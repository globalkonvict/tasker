import { type NextRequest } from "next/server";
import pb from "@/lib/pocketbase/pocketbase";
import { PB_ADMIN_TOKEN } from "@/lib/conts";

const generateFilter = (username?: string, email?: string) => {
  const filterObj: Record<string, string> = {
    filter: username
      ? `username='${username}'`
      : email
      ? `email='${email}'`
      : "",
    requestKey: username ? username : email ? email : "generic",
  };

  if (filterObj.filter === "") {
    delete filterObj.filter;
  }

  return filterObj;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    // Save the admin token to the auth store
    pb.authStore.save(PB_ADMIN_TOKEN!);

    if (!username && !email) {
      return Response.json({
        success: false,
        message: "Please provide a username or email to check availability",
      });
    }

    const records = await pb
      .collection("users")
      .getFullList(200, generateFilter(username as string, email as string));

    if (records.length === 0) {
      return Response.json({ success: true, message: "User not found" });
    }

    return Response.json({ success: false, message: "User found" });
  } catch (error) {
    return Response.json({ success: false, message: error?.toString() });
  } finally {
    // Clear the auth store after the request is completed to prevent token leakage
    pb.authStore.clear();
  }
}
