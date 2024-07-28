"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Form, Button, List, Input, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createComment, fetchComments } from "@/lib/api/requests";
import { Comment as CommentType } from "@/types/api";
import pb from "@/lib/pocketbase/pocketbase";
import { randomColor } from "@/lib/utils";

dayjs.extend(relativeTime);

const { TextArea } = Input;

type CommentListProps = {
  comments: CommentType[];
};

const userColors: Record<string, string> = {};

const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => {
      const { user, content, created } = props;
      if (user && !userColors[user]) {
        userColors[user] = randomColor();
      }
      return (
        <Comment
          author={props.expand?.user?.name}
          avatar={
            <Tooltip title={props.expand?.user?.name}>
              <Avatar
                alt={props.expand?.user?.name}
                style={{ backgroundColor: userColors[user] }}
              >
                {props.expand?.user?.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          }
          content={content}
          datetime={dayjs(created).fromNow()}
        />
      );
    }}
  />
);

type EditorProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
};

const Editor: React.FC<EditorProps> = ({
  onChange,
  onSubmit,
  submitting,
  value,
}) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

type CommentSectionProps = {
  todo: string;
};

const CommentSection: React.FC<CommentSectionProps> = ({ todo }) => {
  const userData = pb.authStore.model ?? {};
  const [comments, setComments] = useState<CommentType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!value) {
      return;
    }
    try {
      setSubmitting(true);
      await createComment({ todo, content: value, user: userData?.id });
      setSubmitting(false);
      setComments([
        ...comments,
        {
          todo,
          content: value,
          user: userData?.id,
          created: new Date().toISOString(),
        },
      ]);
      setValue("");
    } catch (error) {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    fetchComments(todo).then((comments) => {
      setComments(comments);
    });

    pb.collection("comments").subscribe("*", (e) => {
      if (["create", "update", "delete"].includes(e.action)) {
        fetchComments(todo).then((comments) => {
          setComments(comments);
        });
      }
    });

    return () => {
      pb.collection("comments").unsubscribe("*");
    };
  }, [todo]);

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={
          <Tooltip title={userData?.name ?? "User"}>
            <Avatar
              alt={userData?.name ?? "User"}
              style={{ backgroundColor: userColors[userData?.id] }}
            >
              {userData?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};

export default CommentSection;
