// admin/src/pages/AboutManagement.tsx (COMPLETE UPDATE)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  VideoLibrary as VideoIcon,
  Info as InfoIcon,
  RestartAlt as ResetIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import api from '../services/api';

interface VideoItem {
  youtubeLink: string;
  topic: string;
  description: string;
  order: number;
}

const AboutManagement = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    videos: [] as VideoItem[],
    stats: [
      { label: 'Happy Members', value: '12000+', icon: 'users' },
      { label: 'Expert Trainers', value: '50+', icon: 'dumbbell' },
      { label: 'Success Stories', value: '5000+', icon: 'trophy' },
      { label: 'Years Experience', value: '15+', icon: 'award' },
    ],
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      console.log('📥 Fetching About data...');
      const response = await api.getAboutData();

      if (response.success) {
        console.log('✅ About data fetched:', response.data);
        setFormData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (error: any) {
      console.error('❌ Error fetching about data:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================== VIDEO HANDLERS ====================
  
  const addVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        {
          youtubeLink: '',
          topic: '',
          description: '',
          order: prev.videos.length + 1,
        },
      ],
    }));
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index).map((v, i) => ({
        ...v,
        order: i + 1,
      })),
    }));
  };

  const moveVideoUp = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
      return {
        ...prev,
        videos: newVideos.map((v, i) => ({ ...v, order: i + 1 })),
      };
    });
  };

  const moveVideoDown = (index: number) => {
    if (index === formData.videos.length - 1) return;
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
      return {
        ...prev,
        videos: newVideos.map((v, i) => ({ ...v, order: i + 1 })),
      };
    });
  };

  const updateVideo = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.map((video, i) =>
        i === index ? { ...video, [field]: value } : video
      ),
    }));
  };

  // ==================== STAT HANDLERS ====================

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...formData.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      stats: updatedStats,
    }));
  };

 // admin/src/pages/AboutManagement.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    console.log('💾 Saving About data...', formData);
    // @ts-ignore - Temporary fix for JSDoc mismatch
    const response = await api.updateAboutData(formData);

    if (response.success) {
      console.log('✅ About data saved successfully');
      setSnackbar({
        open: true,
        message: 'About page updated successfully! 🎉',
        severity: 'success',
      });
    } else {
      throw new Error(response.message || 'Failed to update');
    }
  } catch (error: any) {
    console.error('❌ Error updating about:', error);
    setSnackbar({
      open: true,
      message: error.message || 'Failed to update',
      severity: 'error',
    });
  } finally {
    setSaving(false);
  }
};

  const handleReset = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset to default values? This cannot be undone.'
      )
    )
      return;

    try {
      console.log('🔄 Resetting About data to default...');
      const response = await api.resetAboutData();

      if (response.success) {
        console.log('✅ Reset successful');
        setFormData(response.data);
        setSnackbar({
          open: true,
          message: 'Reset to default successfully!',
          severity: 'success',
        });
      } else {
        throw new Error(response.message || 'Failed to reset');
      }
    } catch (error: any) {
      console.error('❌ Error resetting:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to reset',
        severity: 'error',
      });
    }
  };

  const extractVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary" mt={2}>
            Loading About Page Data...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            About Page Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your gym's about page content and videos
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAboutData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<ResetIcon />}
            onClick={handleReset}
            disabled={loading || saving}
          >
            Reset to Default
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Basic Info */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Basic Information
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Page Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Welcome to Our Gym"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Brief description about your gym"
                helperText={`${formData.description?.length || 0} characters`}
              />

              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', md: 'row' }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Mission Statement"
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  required
                  placeholder="What is your gym's mission?"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Vision Statement"
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  required
                  placeholder="What is your gym's vision?"
                />
              </Box>
            </Box>
          </Paper>

          {/* Videos Section */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <VideoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  YouTube Videos
                </Typography>
                <Chip
                  label={`${formData.videos?.length || 0} Videos`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addVideo}
                size="small"
              >
                Add Video
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {formData.videos && formData.videos.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={3}>
                {formData.videos.map((video, index) => {
                  const videoId = extractVideoId(video.youtubeLink);
                  
                  return (
                    <Card key={index} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            Video #{index + 1}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => moveVideoUp(index)}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              <ArrowUpIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => moveVideoDown(index)}
                              disabled={index === formData.videos.length - 1}
                              title="Move Down"
                            >
                              <ArrowDownIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeVideo(index)}
                              title="Delete Video"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box display="flex" flexDirection="column" gap={2}>
                          <TextField
                            fullWidth
                            label="Video Topic *"
                            value={video.topic}
                            onChange={(e) => updateVideo(index, 'topic', e.target.value)}
                            placeholder="e.g., Gym Tour, Training Session, Member Testimonial"
                            required
                            size="small"
                          />

                          <TextField
                            fullWidth
                            label="YouTube Link *"
                            value={video.youtubeLink}
                            onChange={(e) => updateVideo(index, 'youtubeLink', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                            size="small"
                          />

                          <TextField
                            fullWidth
                            label="Description (Optional)"
                            value={video.description}
                            onChange={(e) => updateVideo(index, 'description', e.target.value)}
                            placeholder="Brief description of this video"
                            multiline
                            rows={2}
                            size="small"
                          />

                          {videoId && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" mb={1}>
                                Live Preview:
                              </Typography>
                              <Box
                                sx={{
                                  position: 'relative',
                                  paddingBottom: '56.25%',
                                  height: 0,
                                  overflow: 'hidden',
                                  borderRadius: 2,
                                  border: '1px solid #e0e0e0',
                                  mt: 1,
                                }}
                              >
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                                  title={`Preview ${video.topic}`}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                  }}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <Alert severity="info">
                No videos added yet. Click "Add Video" to get started!
              </Alert>
            )}
          </Paper>

          {/* Statistics */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Statistics / Achievements
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Icons available: users, dumbbell, trophy, award
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
              gap={2}
            >
              {formData.stats.map((stat, index) => (
                <Card key={index} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      gutterBottom
                      fontWeight="bold"
                    >
                      Stat #{index + 1}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        fullWidth
                        label="Label"
                        value={stat.label}
                        onChange={(e) =>
                          handleStatChange(index, 'label', e.target.value)
                        }
                        size="small"
                        placeholder="e.g., Happy Members"
                      />
                      <TextField
                        fullWidth
                        label="Value"
                        value={stat.value}
                        onChange={(e) =>
                          handleStatChange(index, 'value', e.target.value)
                        }
                        size="small"
                        placeholder="e.g., 12000+"
                      />
                      <TextField
                        fullWidth
                        label="Icon"
                        value={stat.icon}
                        onChange={(e) =>
                          handleStatChange(index, 'icon', e.target.value)
                        }
                        size="small"
                        select
                        SelectProps={{ native: true }}
                      >
                        <option value="users">👥 Users</option>
                        <option value="dumbbell">🏋️ Dumbbell</option>
                        <option value="trophy">🏆 Trophy</option>
                        <option value="award">🏅 Award</option>
                      </TextField>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              💡 Changes will be reflected on the About page immediately after
              saving. Make sure to preview before publishing.
            </Alert>

            <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
              <Button
                type="button"
                variant="outlined"
                onClick={fetchAboutData}
                disabled={saving}
                size="large"
              >
                Discard Changes
              </Button>

              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={
                    saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                  }
                  disabled={saving || !formData.title || !formData.description}
                  sx={{ minWidth: 180 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AboutManagement;