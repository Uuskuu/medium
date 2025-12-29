import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Button, Divider, Input, List, message, Tag, Spin, Card } from 'antd';
import { LikeOutlined, LikeFilled, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import PostContent from '../../components/Post/PostContent';
import postService from '../../services/postService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PostView = observer(() => {
  const { id } = useParams();
  const { postStore, authStore } = useStores();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
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
      await postService.addComment(id, commentText);
      setCommentText('');
      message.success('Сэтгэгдэл нэмэгдлээ');
      loadComments();
    } catch (error) {
      message.error('Сэтгэгдэл нэмэх үед алдаа гарлаа');
    } finally {
      setSubmittingComment(false);
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
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Title level={1}>{post.title}</Title>

      <Space wrap style={{ marginBottom: 24 }}>
        <Text>
          <UserOutlined /> {post.authorName}
        </Text>
        <Text type="secondary">
          <CalendarOutlined /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString('mn-MN')}
        </Text>
        <Text type="secondary">
          <EyeOutlined /> {post.views} үзсэн
        </Text>
        <Tag color="blue">
          <LikeOutlined /> {post.likes} таалагдсан
        </Tag>
      </Space>

      <Divider />

      <PostContent content={post.content} />

      <Divider />

      <Space>
        <Button
          type={liked ? 'primary' : 'default'}
          icon={liked ? <LikeFilled /> : <LikeOutlined />}
          size="large"
          onClick={handleLike}
        >
          {liked ? 'Таалагдсан' : 'Таалагдах'} ({post.likes})
        </Button>
      </Space>

      <Divider />

      <Title level={3}>Сэтгэгдэл ({comments.length})</Title>

      <Card style={{ marginBottom: 24 }}>
        <TextArea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Сэтгэгдэл бичих..."
          disabled={submittingComment}
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          loading={submittingComment}
          style={{ marginTop: 12 }}
        >
          Сэтгэгдэл нэмэх
        </Button>
      </Card>

      {loadingComments ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{comment.username}</Text>}
                description={
                  <>
                    <Paragraph style={{ marginBottom: 4 }}>{comment.content}</Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(comment.createdAt).toLocaleString('mn-MN')}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
});

export default PostView;

