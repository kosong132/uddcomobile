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


// import React, { useEffect, useState, useRef } from 'react';
// import { View, Platform, PermissionsAndroid, Text, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// const ARFittingScreen = ({ route }) => {
//   const { productId } = route.params || {};
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);
//   const webviewRef = useRef(null);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'This app needs access to your camera for AR features.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.error('Permission request error:', err);
//         }
//       } else {
//         setHasCameraPermission(true);
//       }
//     };
//     requestPermissions();
//   }, []);

//   const handleWebViewMessage = (event) => {
//     const message = event.nativeEvent.data;
//     console.log('[WebView]', message);
//   };

//   if (!productId) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>No product ID provided.</Text>
//       </View>
//     );
//   }

//   // Pass productId as URL param
//   const webViewSource = {
//     uri: `file:///android_asset/virtualTryOn.html?productId=${encodeURIComponent(productId)}`
//   };

//   return (
//     <View style={styles.container}>
//       {hasCameraPermission ? (
//         <WebView
//           ref={webviewRef}
//           source={webViewSource}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//           mediaPlaybackRequiresUserAction={false}
//           allowsInlineMediaPlayback={true}
//           originWhitelist={['*']}
//           mixedContentMode="always"
//           allowFileAccess={true}
//           allowUniversalAccessFromFileURLs={true}
//           onMessage={handleWebViewMessage}
//           style={styles.webview}
//           onError={({ nativeEvent }) => console.error('WebView error:', nativeEvent)}
//           onLoad={() => console.log('WebView content loaded')}
//         />
//       ) : (
//         <Text style={styles.permissionText}>Camera permission is required to display AR content.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   webview: { flex: 1, backgroundColor: '#000' },
//   permissionText: {
//     color: '#fff',
//     textAlign: 'center',
//     marginTop: 50,
//     paddingHorizontal: 20,
//   },
// });

// export default ARFittingScreen;




// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import axios from 'axios';
// import {
//   ViroARSceneNavigator,
//   ViroARScene,
//   Viro3DObject,
//   ViroAmbientLight,
// } from '@reactvision/react-viro';

// const InitialARScene = ({ modelUrl }) => {
//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#ffffff" intensity={200} />
//       <Viro3DObject
//         source={{ uri: modelUrl }}
//         type="GLB"
//         scale={[0.2, 0.2, 0.2]}
//         position={[0, -0.5, -1]}
//       />
//     </ViroARScene>
//   );
// };

// const ARFittingScreen = ({ route }) => {
//   const { productId } = route.params;
//   const [modelUrl, setModelUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const API_BASE = 'http://10.211.104.123:8080'; 
//   console.log('👉 Received productId:', productId);

//   useEffect(() => {
//     const fetchProductModel = async () => {
//       try {
//         // const response = await axios.get(`http://10.0.2.2:8080/products/${productId}`);
//           const response = await axios.get(`${API_BASE}/products/${productId}`);
//         const modelUrl = response.data.modelUrl;
//         console.log('✅ Retrieved model URL from backend:', modelUrl);

//         if (modelUrl) {
//           setModelUrl(modelUrl);
//         } else {
//           setError('AR model URL not found.');
//         }
//       } catch (err) {
//         console.error('Failed to fetch AR model:', err);
//         setError('Failed to load AR model. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductModel();
//   }, [productId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#000" />
//         <Text>Loading AR model...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: 'red' }}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <ViroARSceneNavigator
//       autofocus={true}
//       initialScene={{ scene: () => <InitialARScene modelUrl={modelUrl} /> }}
//       style={{ flex: 1 }}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ARFittingScreen;
