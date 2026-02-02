import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Button, Divider, Input, List, message, Tag, Spin, Card } from 'antd';
import { LikeOutlined, LikeFilled, EyeOutlined, CalendarOutlined, UserOutlined, FlagOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import PostContent from '../../components/Post/PostContent';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import ReportModal from '../../components/ReportModal/ReportModal';
import postService from '../../services/postService';
import { getReadingTime } from '../../utils/readingTime';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PostView = observer(() => {
  const { id } = useParams();
  const { postStore, authStore } = useStores();
  const hasLoadedRef = useRef(false);
  const lastPostIdRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  useEffect(() => {
    if (hasLoadedRef.current && lastPostIdRef.current === id) {
      return;
    }
    lastPostIdRef.current = id;
    hasLoadedRef.current = true;
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    try {
      await postStore.fetchPostById(id);
    } catch (error) {
      message.error('Мэдээг ачаалах үед алдаа гарлаа');
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await postService.getComments(id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    try {
      await postStore.toggleLike(id);
      setLiked(!liked);
      message.success(liked ? 'Таалагдах болиулсан' : 'Таалагдлаа!');
    } catch (error) {
      message.error('Алдаа гарлаа');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      message.warning('Сэтгэгдэл оруулна уу');
      return;
    }

    setSubmittingComment(true);
    try {
      await postService.addComment(id, commentText, null);
      setCommentText('');
      message.success('Сэтгэгдэл нэмэгдлээ');
      loadComments();
    } catch (error) {
      message.error('Сэтгэгдэл нэмэх үед алдаа гарлаа');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = async (parentCommentId) => {
    const text = replyText[parentCommentId];
    if (!text || !text.trim()) {
      message.warning('Хариу оруулна уу');
      return;
    }

    try {
      await postService.addComment(id, text, parentCommentId);
      setReplyText({ ...replyText, [parentCommentId]: '' });
      setReplyingTo(null);
      message.success('Хариу нэмэгдлээ');
      loadComments();
    } catch (error) {
      message.error('Хариу нэмэх үед алдаа гарлаа');
    }
  };

  if (postStore.loading || !postStore.currentPost) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const post = postStore.currentPost;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Title 
        level={1} 
        style={{ 
          fontFamily: 'Playfair Display, Georgia, Cambria, serif',
          fontSize: '42px',
          fontWeight: 700,
          lineHeight: '52px',
          letterSpacing: '-0.02em',
          color: '#242424',
          marginBottom: '16px'
        }}
      >
        {post.title}
      </Title>

      <Space wrap style={{ marginBottom: 32, fontSize: '14px', color: 'rgba(0, 0, 0, 0.54)' }}>
        <Text style={{ color: '#242424', fontWeight: 500 }}>
          {post.authorName}
        </Text>
        <Text type="secondary">·</Text>
        <Text type="secondary">
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text type="secondary">·</Text>
        <Text type="secondary">
          {getReadingTime(post.content)}
        </Text>
      </Space>

      <Divider style={{ marginBottom: 40, borderColor: 'rgba(0, 0, 0, 0.05)' }} />

      <PostContent content={post.content} />

      <Divider style={{ marginTop: 48, marginBottom: 32, borderColor: 'rgba(0, 0, 0, 0.05)' }} />

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Space>
            <Button
              type={liked ? 'default' : 'default'}
              icon={liked ? <LikeFilled /> : <LikeOutlined />}
              size="large"
              onClick={handleLike}
              style={{
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '99em',
                fontSize: '14px',
                fontWeight: 400,
                color: liked ? '#1a8917' : 'rgba(0, 0, 0, 0.68)',
                backgroundColor: liked ? 'rgba(26, 137, 23, 0.1)' : 'transparent',
                height: '40px',
                padding: '0 16px'
              }}
            >
              Таалагдах ({post.likes})
            </Button>

            <Button
              icon={<FlagOutlined />}
              size="large"
              onClick={() => setReportModalVisible(true)}
              style={{
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '99em',
                fontSize: '14px',
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.68)',
                backgroundColor: 'transparent',
                height: '40px',
                padding: '0 16px'
              }}
            >
              Мэдэгдэх
            </Button>
          </Space>

          <ShareButtons 
            url={window.location.href} 
            title={post.title}
            description={post.title}
          />
        </div>
      </div>

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        postId={id}
      />

      <Divider style={{ marginBottom: 32, borderColor: 'rgba(0, 0, 0, 0.05)' }} />

      <Title 
        level={3}
        style={{
          fontFamily: 'Playfair Display, Georgia, Cambria, serif',
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: 24,
          color: '#242424'
        }}
      >
        Сэтгэгдэл ({comments.length})
      </Title>

      <Card 
        style={{ 
          marginBottom: 32, 
          border: '1px solid rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          boxShadow: 'none'
        }}
      >
        <TextArea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Сэтгэгдэл бичих..."
          disabled={submittingComment}
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            border: 'none',
            padding: 0
          }}
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          loading={submittingComment}
          style={{ 
            marginTop: 12,
            backgroundColor: '#1a8917',
            border: 'none',
            borderRadius: '99em',
            fontSize: '14px',
            fontWeight: 400,
            height: '36px'
          }}
        >
          Сэтгэгдэл нэмэх
        </Button>
      </Card>

      {loadingComments ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: 24 }}>
              {/* Main Comment */}
              <div style={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                padding: '24px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ 
                      fontSize: '14px',
                      color: '#242424',
                      fontWeight: 500 
                    }}>
                      {comment.username}
                    </Text>
                    <Paragraph style={{ 
                      marginTop: 8,
                      marginBottom: 8,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'rgba(0, 0, 0, 0.68)'
                    }}>
                      {comment.content}
                    </Paragraph>
                    <Space style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.54)' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {new Date(comment.createdAt).toLocaleString('mn-MN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => setReplyingTo(comment.id)}
                        style={{ padding: 0, height: 'auto', fontSize: '13px' }}
                      >
                        Хариулах {comment.replyCount > 0 && `(${comment.replyCount})`}
                      </Button>
                    </Space>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div style={{ marginTop: 12 }}>
                        <TextArea
                          rows={2}
                          value={replyText[comment.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                          placeholder={`${comment.username}-д хариулах...`}
                          style={{ fontSize: '14px' }}
                        />
                        <Space style={{ marginTop: 8 }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleReply(comment.id)}
                          >
                            Хариулах
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setReplyingTo(null)}
                          >
                            Болих
                          </Button>
                        </Space>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{ marginTop: 16, marginLeft: 24, borderLeft: '2px solid rgba(0, 0, 0, 0.05)', paddingLeft: 16 }}>
                        {comment.replies.map((reply) => (
                          <div key={reply.id} style={{ marginBottom: 16 }}>
                            <Text strong style={{ fontSize: '13px', color: '#242424' }}>
                              {reply.username}
                            </Text>
                            <Paragraph style={{ 
                              marginTop: 4,
                              marginBottom: 4,
                              fontSize: '14px',
                              lineHeight: '20px',
                              color: 'rgba(0, 0, 0, 0.68)'
                            }}>
                              {reply.content}
                            </Paragraph>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {new Date(reply.createdAt).toLocaleString('mn-MN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default PostView;

