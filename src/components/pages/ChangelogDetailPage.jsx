import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import ReactionButtons from '@/components/molecules/ReactionButtons';
import CommentInput from '@/components/molecules/CommentInput';
import CommentItem from '@/components/molecules/CommentItem';
import ChangelogCard from '@/components/molecules/ChangelogCard';
import { changelogService } from '@/services/api/changelogService';
import { commentService } from '@/services/api/commentService';

const ChangelogDetailPage = () => {
  const { version } = useParams();
  const navigate = useNavigate();
  const [changelog, setChangelog] = useState(null);
  const [adjacentVersions, setAdjacentVersions] = useState({ previous: null, next: null });
  const [relatedChangelogs, setRelatedChangelogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);

  useEffect(() => {
    loadChangelogData();
  }, [version]);

  const loadChangelogData = async () => {
    try {
      setLoading(true);
      setError(null);

      const changelogData = await changelogService.getByVersion(version);
      setChangelog(changelogData);

      const [adjacent, related, changelogComments] = await Promise.all([
        changelogService.getAdjacentVersions(changelogData.version),
        changelogService.getRelatedChangelogs(changelogData.Id),
        commentService.getByPostId(changelogData.Id)
      ]);

      setAdjacentVersions(adjacent);
      setRelatedChangelogs(related);
      setComments(changelogComments);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load changelog');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'New Feature': 'Sparkles',
      'Improvement': 'Zap',
      'Bug Fix': 'Bug',
      'Technical': 'Wrench',
      'Breaking Change': 'AlertTriangle',
      'Removed': 'Trash2',
      'Documentation': 'FileText',
      'Security': 'Shield'
    };
    return icons[category] || 'Tag';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'New Feature': 'bg-blue-100 text-blue-700',
      'Improvement': 'bg-purple-100 text-purple-700',
      'Bug Fix': 'bg-red-100 text-red-700',
      'Technical': 'bg-gray-100 text-gray-700',
      'Breaking Change': 'bg-orange-100 text-orange-700',
      'Removed': 'bg-amber-100 text-amber-700',
      'Documentation': 'bg-green-100 text-green-700',
      'Security': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleReact = async (reactionType) => {
    try {
      await changelogService.toggleReaction(changelog.Id, reactionType);
      const updated = await changelogService.getByVersion(version);
      setChangelog(updated);
      toast.success('Reaction added!');
    } catch (err) {
      toast.error('Failed to add reaction');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `${changelog.version}: ${changelog.title}`;
    const text = changelog.description;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFeedback = async (wasHelpful) => {
    try {
      await changelogService.submitHelpfulFeedback(changelog.Id, wasHelpful);
      setFeedbackGiven(true);
      setFeedbackType(wasHelpful ? 'yes' : 'no');
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleCreateComment = async (content) => {
    try {
      const newComment = await commentService.create({
        postId: changelog.Id,
        content,
        author: 'Current User',
        authorId: 'user-1'
      });
      setComments([...comments, newComment]);
      toast.success('Comment posted!');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleVoteComment = async (commentId, hasVoted) => {
    try {
      await commentService.voteComment(commentId, hasVoted);
      const updatedComments = await commentService.getByPostId(changelog.Id);
      setComments(updatedComments);
    } catch (err) {
      toast.error('Failed to vote on comment');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!changelog) return <Error message="Changelog not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
            <Link to="/changelog" className="text-gray-500 hover:text-gray-900 transition-colors">
              Changelog
            </Link>
            <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">v{changelog.version}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjacentVersions.next && navigate(`/changelog/v${adjacentVersions.next.version.replace(/\./g, '-')}`)}
            disabled={!adjacentVersions.next}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="ChevronLeft" size={16} />
            {adjacentVersions.next ? `v${adjacentVersions.next.version}` : 'Newer'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => adjacentVersions.previous && navigate(`/changelog/v${adjacentVersions.previous.version.replace(/\./g, '-')}`)}
            disabled={!adjacentVersions.previous}
            className="inline-flex items-center gap-2"
          >
            {adjacentVersions.previous ? `v${adjacentVersions.previous.version}` : 'Older'}
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>

        {/* Changelog Header */}
        <article className="bg-white rounded-lg shadow-card mb-6">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-5xl font-bold text-primary-600 mb-2">v{changelog.version}</div>
                <div className="text-gray-500">{format(new Date(changelog.releaseDate), 'MMMM d, yyyy')}</div>
              </div>
              
              {/* Share & Print Buttons */}
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter"
                >
                  <ApperIcon name="Twitter" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                >
                  <ApperIcon name="Linkedin" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  title="Copy link"
                >
                  <ApperIcon name="Link" size={18} />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  title="Print / Export PDF"
                >
                  <ApperIcon name="Printer" size={18} />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{changelog.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {[...new Set(changelog.updates.map(u => u.category))].map((category, index) => (
                <Badge key={index} variant="secondary" className={getCategoryColor(category)}>
                  <ApperIcon name={getCategoryIcon(category)} size={14} className="mr-1" />
                  {category}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">{changelog.description}</p>
          </div>

          {/* Updates List */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What's New</h2>
            <div className="space-y-6">
              {changelog.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', getCategoryColor(update.category))}>
                    <ApperIcon name={getCategoryIcon(update.category)} size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{update.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reactions */}
          <div className="p-8 border-b border-gray-100 print:hidden">
            <ReactionButtons 
              reactions={changelog.reactions}
              onReact={handleReact}
            />
          </div>
        </article>

        {/* Was This Helpful Section */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6 print:hidden">
          <div className="text-center">
            {!feedbackGiven ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this helpful?</h3>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <ApperIcon name="ThumbsUp" size={18} />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(false)}
                    className="inline-flex items-center gap-2"
                  >
                    <ApperIcon name="ThumbsDown" size={18} />
                    No
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <ApperIcon name="Check" size={20} />
                <span className="font-medium">Thank you for your feedback!</span>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-6 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
          
          <div className="mb-6">
            <CommentInput
              onSubmit={handleCreateComment}
              placeholder="Share your thoughts about this release..."
              submitLabel="Post Comment"
            />
          </div>

          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem
                key={comment.Id}
                comment={comment}
                currentUserId="user-1"
                onVote={handleVoteComment}
                onReply={async (content) => {
                  try {
                    await commentService.create({
                      postId: changelog.Id,
                      parentId: comment.Id,
                      content,
                      author: 'Current User',
                      authorId: 'user-1'
                    });
                    const updatedComments = await commentService.getByPostId(changelog.Id);
                    setComments(updatedComments);
                    toast.success('Reply posted!');
                  } catch (err) {
                    toast.error('Failed to post reply');
                  }
                }}
                onEdit={async (commentId, content) => {
                  try {
                    await commentService.update(commentId, { content });
                    const updatedComments = await commentService.getByPostId(changelog.Id);
                    setComments(updatedComments);
                    toast.success('Comment updated!');
                  } catch (err) {
                    toast.error('Failed to update comment');
                  }
                }}
                onDelete={async (commentId) => {
                  try {
                    await commentService.delete(commentId);
                    const updatedComments = await commentService.getByPostId(changelog.Id);
                    setComments(updatedComments);
                    toast.success('Comment deleted!');
                  } catch (err) {
                    toast.error('Failed to delete comment');
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedChangelogs.length > 0 && (
          <div className="print:hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedChangelogs.map(related => (
                <ChangelogCard
                  key={related.Id}
                  changelog={related}
                  viewMode="compact"
                  clickable={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChangelogDetailPage;