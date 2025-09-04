import React, { useRef } from "react";
import { Switch, SwitchRef } from "@/components/ui/switch";
import MenuItem, { MenuGroup } from "@/components/blocks/menu-item";
import { useFeatures } from "@/contexts/FeaturesContext";
import SafeContainer from "@/components/SafeContainer";
import { useNavigation } from "@react-navigation/native";

export default function Preferences() {
  const { swipeEnabled, setSwipeEnabled } = useFeatures();
  const [switchLoading, setSwitchLoading] = React.useState(false);
  const switchRef = useRef<SwitchRef>(null);
  const navigation = useNavigation();

  const handleSwitchChange = async (newValue: boolean) => {
    setSwitchLoading(true);
    // await new Promise((r) => setTimeout(r, 1000));
    setSwipeEnabled(newValue);
    setSwitchLoading(false);
  };

  const handleMenuItemPress = () => {
    if (switchLoading) return;
    switchRef.current?.triggerPress();
  };

  const handleMenuItemPressIn = () => {
    if (switchLoading) return;
    switchRef.current?.onPressIn();
  };

  const handleMenuItemPressOut = () => {
    if (switchLoading) return;
    switchRef.current?.onPressOut();
  };

  return (
    <SafeContainer
      header={{
        title: "Preferences",
        showBackButton: true,
        onBackPress: () => navigation.goBack(),
      }}
    >
      <MenuGroup title="Tabs" titleStyle={{ marginTop: 20 }}>
        <MenuItem
          title="Swipe Between Tabs"
          subtitle="Allow horizontal tab swipes"
          onPress={handleMenuItemPress}
          onPressIn={handleMenuItemPressIn}
          onPressOut={handleMenuItemPressOut}
          disabled={switchLoading}
          isLast
          isFirst
          rightAction={
            <Switch
              ref={switchRef}
              value={swipeEnabled}
              onValueChange={handleSwitchChange}
              loading={switchLoading}
              style={{ marginRight: 10 }}
            />
          }
        />
      </MenuGroup>
    </SafeContainer>
  );
}
