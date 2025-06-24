import React, { useEffect, useState ,useRef} from 'react';
import { View, Platform, PermissionsAndroid, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';


const ARFittingScreen = ({ route }) => {
  const { modelUrl } = route.params || {};
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const webviewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log('[WebView]', message); // Logs HTML console output here!
  };
  useEffect(() => {
    console.log('[ARFittingScreen] modelUrl:', modelUrl);

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs access to your camera for AR features.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.error('Permission request error:', err);
        }
      } else {
        setHasCameraPermission(true);
      }
    };
    requestPermissions();
  }, [modelUrl]);

  const injectedJS = `
  (function waitForSetModelUrl() {
    if (window.setModelUrl) {
      window.setModelUrl(${JSON.stringify(modelUrl)});
      console.log('[injectedJS] setModelUrl called with: ${modelUrl}');
    } else {
      setTimeout(waitForSetModelUrl, 100);
    }
  })();
  true;
`;

  return (
    <View style={styles.container}>
      {hasCameraPermission ? (
        <WebView
          source={{ uri: 'file:///android_asset/virtualTryOn.html' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          originWhitelist={['*']}
          mixedContentMode="always"
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          injectedJavaScript={injectedJS}
          androidHardwareAccelerationDisabled={false}
          onShouldStartLoadWithRequest={(request) => true}
          onLoad={() => console.log('WebView content loaded')}

          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
          onMessage={handleWebViewMessage}
          style={styles.webview}
        />
      ) : (
        <Text style={styles.permissionText}>Camera permission is required to display AR content.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
});

export default ARFittingScreen;

