import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getAllCoe } from "../utils/storage";
import ScreenHeader from "../components/ScreenHeader";

export default function ViewAllCoeScreen({ navigation }) {
  const [coes, setCoes] = useState([]);

  const loadData = async () => {
    const data = await getAllCoe();
    setCoes(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item, index }) => (
    <View className="bg-gray-50 p-4 rounded-xl mb-3">
      
      <Text className="text-primary font-bold text-lg">
        {index + 1}. {item.name}
      </Text>

      <Text className="text-gray-600 mt-1">
        Incharge: {item.incharge}
      </Text>

    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">

      {/* Header */}
      <ScreenHeader title="All COEs" navigation={navigation} />

      <View className="px-4 mt-2 flex-1">

        {/* Card Container */}
        <View className="bg-white rounded-2xl p-5 shadow flex-1">

          <Text className="text-xl font-bold text-primary mb-4">
            COE List
          </Text>

          {coes.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400 text-base">
                No COE Added Yet
              </Text>
            </View>
          ) : (
            <FlatList
              data={coes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}

        </View>

      </View>

    </SafeAreaView>
  );
}