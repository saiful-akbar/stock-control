import React from 'react';
import { Box, Typography } from '@material-ui/core';
import bugImage from 'src/assets/images/ilustration/bug.svg';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Perbarui state agar proses render berikutnya akan menampilkan antarmuka darurat.
  static getDerivedStateFromError(error) {
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
      return (
        <Box
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
          alignItems="center"
          p={5}
          width="100%"
          style={{
            height: 'calc(100vh - 48px)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="textPrimary">
            Something went wrong.
          </Typography>

          <Typography variant="subtitle1" color="textSecondary">
            {this.state.error && this.state.error.toString()}
          </Typography>

          <Box mt={3}>
            <img src={bugImage} alt="bug" width="60%" />
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
