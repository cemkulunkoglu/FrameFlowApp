import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
  Share,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ThemedText } from '../components/ThemedText';
import ColorPicker from 'react-native-wheel-color-picker';
import ViewShot, { captureRef } from "react-native-view-shot";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.65;
const FRAME_SIZE = IMAGE_SIZE + 80;
const TEXT_RADIUS = FRAME_SIZE / 2 - 24;
const START_ANGLE = Math.PI;
const CHAR_SPACING = Math.PI / 24;

// ViewShot için tip tanımlaması
interface ViewShotType extends React.Component {
  capture: () => Promise<string>;
}

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [frameColor, setFrameColor] = useState('#0071e3');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [frameText, setFrameText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const viewShotRef = useRef<ViewShotType>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const turkishToUpper = (text: string) => {
    return text
      .replace(/i/g, 'İ')
      .replace(/ı/g, 'I')
      .replace(/ç/g, 'Ç')
      .replace(/ğ/g, 'Ğ')
      .replace(/ö/g, 'Ö')
      .replace(/ş/g, 'Ş')
      .replace(/ü/g, 'Ü')
      .toUpperCase();
  };

  const handleTextChange = (text: string) => {
    setFrameText(turkishToUpper(text));
  };

  const shareImage = async () => {
    if (selectedImage) {
      try {
        await Share.share({
          url: selectedImage,
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setFrameText('');
    setShowColorPicker(false);
    setShowTextColorPicker(false);
  };

  // İzin isteme fonksiyonu
  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  // Fotoğrafı kaydetme fonksiyonu
  const saveImage = async () => {
    if (viewShotRef.current) {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          alert('Fotoğrafı kaydetmek için galeri izni gerekiyor.');
          return;
        }

        // capture metodunu güvenli bir şekilde çağıralım
        const uri = await viewShotRef.current.capture();
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('FrameFlow', asset, false);

        alert('Fotoğraf başarıyla galeriye kaydedildi!');
      } catch (error) {
        console.error('Kaydetme hatası:', error);
        alert('Fotoğraf kaydedilirken bir hata oluştu.');
      }
    }
  };

  // Rengin açık/koyu olduğunu kontrol eden yardımcı fonksiyon
  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>FrameFlow</ThemedText>
      </View>

      <ThemedText style={styles.subtitle}>
        Profesyonel profil fotoğrafları için çerçeve ve metin düzenleyici
      </ThemedText>

      {/* Fotoğraf Bölümü */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <View style={styles.previewContainer}>
            <View style={styles.previewWrapper}>
              <ViewShot
                ref={viewShotRef}
                options={{
                  format: "png",
                  quality: 1,
                  result: "tmpfile"
                }}
                style={styles.imageWrapper}
              >
                <View style={styles.frameContainer}>
                  <LinearGradient
                    colors={[
                      frameColor,
                      `${frameColor}CC`,
                      `${frameColor}88`,
                      `${frameColor}11`,
                      'transparent'
                    ]}
                    style={styles.frameGradient}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                  />
                  {frameText && frameText.split('').map((char, index) => {
                    const angle = START_ANGLE + index * CHAR_SPACING;
                    
                    const charX = FRAME_SIZE / 2 + Math.cos(angle) * TEXT_RADIUS;
                    const charY = FRAME_SIZE / 2 - Math.sin(angle) * TEXT_RADIUS;
                    
                    return (
                      <ThemedText
                        key={index}
                        style={[
                          styles.frameText,
                          {
                            position: 'absolute',
                            left: charX,
                            top: charY,
                            transform: [
                              { translateX: -14 },
                              { translateY: -14 },
                              { rotate: `${angle + Math.PI / 2}rad` },
                              { rotate: '180deg' },
                              { rotate: `${-index * (Math.PI / 12)}rad` },
                            ],
                            color: textColor,
                            zIndex: 10,
                          },
                        ]}
                      >
                        {char}
                      </ThemedText>
                    );
                  })}
                </View>
              </ViewShot>

              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: frameColor }]}
                  onPress={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowTextColorPicker(false);
                  }}
                >
                  <ThemedText style={styles.buttonText}>Çerçeve Rengi</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: textColor }]}
                  onPress={() => {
                    setShowTextColorPicker(!showTextColorPicker);
                    setShowColorPicker(false);
                  }}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    { color: isLightColor(textColor) ? '#000' : '#fff' }
                  ]}>
                    Metin Rengi
                  </ThemedText>
                </TouchableOpacity>

                <TextInput
                  style={styles.textInput}
                  placeholder="Çerçeveye metin ekle"
                  value={frameText}
                  onChangeText={handleTextChange}
                  maxLength={20}
                  placeholderTextColor="#666"
                />

                {showColorPicker && (
                  <View style={styles.colorPickerContainer}>
                    <ColorPicker
                      color={frameColor}
                      onColorChange={setFrameColor}
                      thumbSize={30}
                      sliderSize={30}
                      noSnap={true}
                      row={false}
                    />
                  </View>
                )}

                {showTextColorPicker && (
                  <View style={styles.colorPickerContainer}>
                    <ColorPicker
                      color={textColor}
                      onColorChange={setTextColor}
                      thumbSize={30}
                      sliderSize={30}
                      noSnap={true}
                      row={false}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={saveImage}
                >
                  <ThemedText style={styles.buttonText}>Fotoğrafı Kaydet</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.resetButton]}
                  onPress={resetImage}
                >
                  <ThemedText style={styles.buttonText}>Yeni Fotoğraf</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={pickImage}
          >
            <ThemedText style={styles.buttonText}>Fotoğraf Seç</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Nasıl Kullanılır ve Özellikler kartları */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Nasıl Kullanılır?</ThemedText>
          {steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>{step}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>📝 Özellikler</ThemedText>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <ThemedText style={styles.featureText}>• {feature}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const steps = [
  'Fotoğraf Seç butonuna tıklayarak bir fotoğraf yükleyin',
  'Fotoğrafı sürükleyerek istediğiniz şekilde konumlandırın',
  'Çerçeve rengini değiştirmek için renk seçiciyi kullanın',
  'İsterseniz çerçeveye metin ekleyin ve metin rengini ayarlayın',
  'Kalite seçeneğini belirleyin ve Fotoğrafı İndir butonuna tıklayın'
];

const features = [
  'Yüksek kaliteli çıktı (1080p, 2K, 4K)',
  'Dairesel kesim ve saydam arka plan',
  'Özelleştirilebilir çerçeve rengi',
  'Kavisli metin ekleme',
  'Metin rengi özelleştirme',
  'Otomatik büyük harf dönüşümü',
  'Tüm sosyal medya platformlarına uygun'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SF-Pro-Display-Bold',
    color: '#1d1d1f',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1d1d1f',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  previewWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  imageWrapper: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0071e3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  uploadButton: {
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorPickerContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card: {
    backgroundColor: '#f5f5f7',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 15,
    color: '#1d1d1f',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0071e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SF-Pro-Display-Medium',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#1d1d1f',
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    opacity: 0.8,
    color: '#1d1d1f',
  },
  frameContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    zIndex: 2,
  },
  frameGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: FRAME_SIZE / 2,
    opacity: 0.9,
    zIndex: 1,
  },
  frameText: {
    position: 'absolute',
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Bold',
    textAlign: 'center',
    width: 30,
    height: 30,
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#1d1d1f',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  controlsContainer: {
    width: '100%',
    padding: 20,
    gap: 10,
  },
  resetButton: {
    backgroundColor: '#ff3b30',
  },
  saveButton: {
    backgroundColor: '#34c759', // Apple tarzı yeşil renk
  },
  cardsContainer: {
    marginTop: 20,
  },
});