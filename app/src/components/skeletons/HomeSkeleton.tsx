import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{ marginVertical: 10, paddingHorizontal: 15 }}>
        {/* Header */}
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} />
          <SkeletonPlaceholder.Item marginLeft={10}>
            <SkeletonPlaceholder.Item width={140} height={18} borderRadius={4} />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={100}
              height={14}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Search Bar */}
        <SkeletonPlaceholder.Item
          marginTop={20}
          width="100%"
          height={40}
          borderRadius={8}
        />

        {/* Promo Banner */}
        <SkeletonPlaceholder.Item
          marginTop={20}
          width="100%"
          height={160}
          borderRadius={12}
        />

        {/* Kick Start Free Trial Section */}
        <SkeletonPlaceholder.Item marginTop={25}>
          <SkeletonPlaceholder.Item width={200} height={18} borderRadius={6} />
          <SkeletonPlaceholder.Item
            marginTop={10}
            width="100%"
            height={80}
            borderRadius={10}
          />
        </SkeletonPlaceholder.Item>

        {/* Highlights Section Title */}
        <SkeletonPlaceholder.Item
          marginTop={30}
          width={180}
          height={20}
          borderRadius={6}
        />

        {/* 4 Highlight Cards (2x2 grid) */}
        <SkeletonPlaceholder.Item
          marginTop={20}
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width="48%"
            height={100}
            borderRadius={12}
            marginBottom={12}
          />
          <SkeletonPlaceholder.Item
            width="48%"
            height={100}
            borderRadius={12}
            marginBottom={12}
          />
          <SkeletonPlaceholder.Item
            width="48%"
            height={100}
            borderRadius={12}
          />
          <SkeletonPlaceholder.Item
            width="48%"
            height={100}
            borderRadius={12}
          />
        </SkeletonPlaceholder.Item>
      </View>
    </SkeletonPlaceholder>
  );
};

export default HomeSkeleton;
