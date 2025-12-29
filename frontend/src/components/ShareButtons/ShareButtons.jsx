import React from 'react';
import { Space, Button, message } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  LinkOutlined,
  MailOutlined 
} from '@ant-design/icons';
import './ShareButtons.css';

const ShareButtons = ({ url, title, description }) => {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('Холбоос хуулагдлаа!');
    } catch (error) {
      message.error('Холбоос хуулахад алдаа гарлаа');
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareDescription}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="share-buttons-container">
      <Space size="small" wrap>
        <Button
          className="share-button facebook"
          icon={<FacebookOutlined />}
          onClick={handleFacebookShare}
          size="large"
        />
        <Button
          className="share-button twitter"
          icon={<TwitterOutlined />}
          onClick={handleTwitterShare}
          size="large"
        />
        <Button
          className="share-button linkedin"
          icon={<LinkedinOutlined />}
          onClick={handleLinkedInShare}
          size="large"
        />
        <Button
          className="share-button copy"
          icon={<LinkOutlined />}
          onClick={handleCopyLink}
          size="large"
        />
        <Button
          className="share-button email"
          icon={<MailOutlined />}
          onClick={handleEmailShare}
          size="large"
        />
      </Space>
    </div>
  );
};

export default ShareButtons;

