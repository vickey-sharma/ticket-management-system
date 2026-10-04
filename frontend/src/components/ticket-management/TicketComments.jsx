import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PrimaryButton from "../ui/PrimaryButton";
import { addComment, getComments } from "../../services/comment.service";

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await getComments(ticketId);

      setComments(response?.data?.comments || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredComment = comment.trim();

    if (!filteredComment) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setAddingComment(true);

      await addComment(ticketId, filteredComment);

      setComment("");
      toast.success("Comment added");

      await fetchComments();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write a comment..."
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
        />

        <div className="mt-3 flex justify-end">
          <PrimaryButton
            type="submit"
            loading={addingComment}
          >
            Add Comment
          </PrimaryButton>
        </div>
      </form>

      {loading ? (
        <div className="py-6 text-center text-sm text-gray-500">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.userId?.fullName ||
                      item.userId?.email ||
                      "User"}
                  </p>

                  {item.userId?.role && (
                    <p className="text-xs capitalize text-gray-400">
                      {item.userId.role}
                    </p>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {item.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketComments;