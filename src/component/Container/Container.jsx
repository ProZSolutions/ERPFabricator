import { ScrollView, SafeAreaView, View } from "react-native";

function Container({ children, paddingBottom = 80, containerClass = '', marginTop = 0  }) {
  return (
    <SafeAreaView className={`flex-1 ${containerClass}`}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: paddingBottom
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="p-4 bg-white"
      >
        <View style={{ marginTop: marginTop }}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Container;
