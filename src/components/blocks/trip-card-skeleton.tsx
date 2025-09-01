import React from "react";
import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";

const TripCardSkeleton: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => fadeInOut());
    };

    fadeInOut();
    return () => fadeAnim.stopAnimation();
  }, [fadeAnim]);

  const SkeletonBox = ({ width, height, className = "" }: { width: string; height: string; className?: string }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        backgroundColor: "#374151",
        borderRadius: 4,
      }}
      className={`${width} ${height} ${className}`}
    />
  );

  return (
    <View className="py-2">
      <View className="max-w-2xl rounded-2xl border border-border bg-card">
        {/* Top Section - Three Columns */}
        <View className="flex-row py-4 px-3">
          {/* Column 1: Logo */}
          <View className="mr-3">
            <SkeletonBox width="w-6" height="h-6" />
          </View>

          {/* Column 2: Flight Details */}
          <View className="flex-1">
            {/* Times */}
            <View style={{ marginBottom: 15 }} className="flex-row items-center gap-2">
              <SkeletonBox width="w-16" height="h-5" />
              <SkeletonBox width="w-16" height="h-5" />
            </View>

            {/* Route */}
            <SkeletonBox width="w-32" height="h-3" className="mb-1.5" />

            {/* Airline */}
            <SkeletonBox width="w-24" height="h-3" className="mb-1.5" />

            {/* Duration and Stops */}
            <SkeletonBox width="w-20" height="h-3" className="mb-1.5" />

            {/* Layover Details */}
            <SkeletonBox width="w-28" height="h-3" />
          </View>

          {/* Column 3: Price */}
          <View className="items-end">
            <SkeletonBox width="w-20" height="h-6" className="mb-3" />
            <SkeletonBox width="w-24" height="h-3" />
          </View>
        </View>

        {/* Separator */}
        <View className="border-t border-border" />

        {/* Bottom Section */}
        <View className="flex-row justify-end p-3 pb-[12px]">
          <SkeletonBox width="w-20" height="h-5" />
        </View>
      </View>
    </View>
  );
};

export default TripCardSkeleton;
