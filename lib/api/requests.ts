import {
  PB_COMMENT_COLLECTION,
  PB_TODO_COLLECTION,
  PB_USER_COLLECTION,
} from "../conts";
import { message } from "antd";
import pb from "@/lib/pocketbase/pocketbase";
import { SortOrder } from "antd/es/table/interface";
import { TaskSearchParam, TaskItem, Comment, UserSearchParam, User } from "@/types/api";
import { generatePBFilter, generatePBSort } from "@/lib/pocketbase/utils";

/**
 * Fetch all users from pocketbase (for admins to assign tasks) when called by non admin users it will return only their own user
 * @returns users
 */
export const getAllUsers = async () => {
  try {
    const response = await pb.collection(PB_USER_COLLECTION).getList(1, 500);
    return response.items.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    return [];
  }
};

/**
 * Fetch tasks from pocketbase for the table component in the tasks page
 * @param params
 * @param sort
 * @returns tasks
 */
export const fetchTasks = async (
  params: Partial<TaskSearchParam>,
  sort: Record<"startDate" | "endDate" | "timer", SortOrder>
) => {
  try {
    const { current: page, pageSize, ...filterParams } = params;
    const sortStr = generatePBSort(sort);
    const pbFilter = generatePBFilter(filterParams);

    const response = await pb
      .collection(PB_TODO_COLLECTION)
      .getList<TaskItem>(page, pageSize, {
        expand: "assignedTo",
        filter: pbFilter,
        sort: sortStr,
      });

    return {
      data: response.items,
      total: response.totalItems,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    return {
      data: [],
      success: false,
    };
  }
};

/**
 * Updates a task in pocketbase
 * @param id task id
 * @param values task values to update
 */
export const updateTask = async (id: string, values: Partial<TaskItem>) => {
  try {
    await pb.collection(PB_TODO_COLLECTION).update(id, values);
    message.success("Task updated successfully");
  } catch (error) {
    message.error("Failed to update task");
  }
};

/**
 * Deletes a task from pocketbase
 * @param values ids of tasks to delete
 * @param setOpenCreateTask
 */
export const deleteTasks = async (ids: string[]) => {
  try {
    const bulkDelete = ids.map((id) =>
      pb.collection(PB_TODO_COLLECTION).delete(id as string)
    );
    await Promise.all(bulkDelete);
    message.success("Deleted selected tasks");
  } catch (error) {
    console.log(error);
    message.error("Failed to delete selected tasks");
  }
};

/**
 * Fetches all comments for a task from pocketbase
 * @param taskId task id
 * @returns comments
 */
export const fetchComments = async (taskId: string) => {
  try {
    const response = await pb
      .collection<Comment>(PB_COMMENT_COLLECTION)
      .getList(1, 500, {
        filter: `todo='${taskId}'`,
        expand: "user",
      });
    return response.items;
  } catch (error) {
    return [];
  }
};

/**
 * Creates a comment in pocketbase
 * @param values comment values
 * @param todo task id
 */
export const createComment = async (values: Comment) => {
  try {
    await pb.collection(PB_COMMENT_COLLECTION).create({
      ...values,
    });
    message.success("Comment added successfully");
  } catch (error) {
    message.error("Failed to add comment");
  }
};

/**
 * Updates a task timer in pocketbase
 * @param id task id
 * @param timer new timer value
 * @param startTime new start time value
 */
export const updateTaskTimer = async (
  id: string,
  timer: number,
  startTime: string | null = null
) => {
  try {
    await pb.collection(PB_TODO_COLLECTION).update(id, { timer, startTime });
  } catch (error) {
    console.error("Failed to update task timer", error);
  }
};

/**
 * Fetch users from pocketbase for the table component in the users page
 * @param params
 * @param sort
 * @returns users
 */
export const fetchUsers = async (
  params: Partial<UserSearchParam>,
  sort: Record<string, SortOrder>
) => {
  try {
    console.log("fetchUsers", params, sort);
    const { current, pageSize, ...filterParams } = params;
    const sortStr = generatePBSort(sort);
    const pbFilter = generatePBFilter(filterParams);

    const response = await pb
      .collection(PB_USER_COLLECTION)
      .getList<User>(current, pageSize, {
        filter: pbFilter,
        sort: sortStr,
      });

    return {
      data: response.items,
      total: response.totalItems,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch users", error);
    return {
      data: [],
      success: false,
    };
  }
};