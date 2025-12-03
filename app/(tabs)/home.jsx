import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import Profile from "../../components/Profile";
import { useState } from "react";
import { suggest } from "../../Fetch";
import { exportToSpotify } from "../../Fetch";

const home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null); // ✅ Modal için
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await suggest(prompt);

      if (response.success) {
        console.log("Playlist oluşturuldu:", response.data);
        setPlaylist(response.data);
        Alert.alert("Başarılı", `${response.data.length} şarkı bulundu!`);
      } else {
        Alert.alert("Hata", response.message || "Bir hata oluştu");
      }
    } catch (error) {
      Alert.alert("Hata", "Bağlantı hatası oluştu");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!playlist || playlist.length === 0) {
      Alert.alert("Uyarı", "Önce bir playlist oluşturun");
      return;
    }

    try {
      setIsExporting(true);
      Alert.alert(
        "Playlist Oluşturuluyor",
        "Spotify hesabınıza aktarılıyor...",
        [{ text: "Tamam" }]
      );

      // ✅ Track ID'lerini çıkar
      const trackIds = playlist.map(
        (song) => song.spotifyUrl.split("/track/")[1]
      );

      // ✅ Playlist adı ve açıklaması
      const playlistName = `AI Playlist - ${new Date().toLocaleDateString()}`;
      const playlistDescription = `Created with Postify AI: ${prompt.substring(0, 50)}...`;

      // ✅ Backend'e gönder
      const result = await exportToSpotify(
        playlistName,
        playlistDescription,
        trackIds
      );

      if (result.success) {
        Alert.alert("Başarılı! 🎉", "Playlist Spotify hesabınıza eklendi!", [
          {
            text: "Tamam",
            onPress: () => {
              // ✅ Formu temizle
              setPrompt("");
              setPlaylist(null);
            },
          },
        ]);
      } else {
        Alert.alert("Hata", result.message || "Playlist oluşturulamadı");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Hata", "Bir şeyler ters gitti");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <SafeAreaView className="h-full w-full bg-[#121212]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Profile />

        <Text className="text-white px-5 mt-10 text-xl font-bold">
          Create a Playlist
        </Text>

        <View className="px-4 mt-4">
          <View className="bg-[#282828] rounded-2xl overflow-hidden">
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Nasıl bir playlist oluşturmak istersiniz?"
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
              className="text-white px-4 py-3 h-28"
              editable={!loading}
            />

            <TouchableOpacity
              className={`m-2 py-3 rounded-2xl items-center ${
                !prompt.trim() || loading ? "bg-[#1ED760]/50" : "bg-[#1ED760]"
              }`}
              activeOpacity={0.8}
              onPress={handleGenerate}
              disabled={!prompt.trim() || loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="font-bold text-black">Generate Playlist</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Playlist Liste (Custom UI) */}
        {playlist && playlist.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-white text-xl font-bold mb-4">
              Generated Playlist ({playlist.length} songs)
            </Text>

            {playlist.map((song, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSong(song)}
                activeOpacity={0.7}
                className="flex-row items-center bg-[#282828] p-3 rounded-lg mb-3">
                {/* Album Cover */}
                <Image
                  source={{ uri: song.albumImage }}
                  className="w-16 h-16 rounded"
                />

                {/* Track Info */}
                <View className="flex-1 ml-3">
                  <Text className="text-white font-bold" numberOfLines={1}>
                    {song.track}
                  </Text>
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>

                {/* Play Icon */}
                <View className="bg-[#1ED760] w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-black text-xl">▶</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Export to Spotify Button */}
            <TouchableOpacity
              className="bg-[#1ED760] py-4 rounded-2xl items-center mt-4 mb-6"
              activeOpacity={0.8}
              onPress={handleExport} // ✅ handleExport fonksiyonu
            >
              <Text className="font-bold text-black text-base">
                Export to Spotify
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ✅ Modal Player */}
      <Modal
        visible={!!selectedSong}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSong(null)}>
        <View className="flex-1 bg-black/95 justify-center p-4">
          <View className="bg-[#282828] rounded-2xl overflow-hidden">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setSelectedSong(null)}
              activeOpacity={0.8}
              className="absolute top-4 right-4 z-10 bg-black/70 w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-white text-xl font-bold">✕</Text>
            </TouchableOpacity>

            {/* Song Info */}
            {selectedSong && (
              <>
                <View className="p-4 pt-6">
                  <Text className="text-white text-lg font-bold">
                    {selectedSong.track}
                  </Text>
                  <Text className="text-gray-400 mt-1">
                    {selectedSong.artist}
                  </Text>
                </View>

                {/* Spotify Player */}
                <View className="h-96">
                  <WebView
                    source={{
                      uri: `https://open.spotify.com/embed/track/${
                        selectedSong.spotifyUrl.split("/track/")[1]
                      }?utm_source=generator&theme=0`,
                    }}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default home;
