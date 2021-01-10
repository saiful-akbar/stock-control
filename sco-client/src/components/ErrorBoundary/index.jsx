import React from 'react';
import { Box, Typography } from '@material-ui/core';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state agar proses render berikutnya akan menampilkan antarmuka darurat.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Anda juga bisa mencatat kesalahan ke layanan pencatat kesalahan
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // menampilkan antarmuka darurat Anda di sini
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={5}
        >
          <Typography variant="h5" color="textPrimary">Something went wrong.</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {this.state.error && this.state.error.toString()}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;