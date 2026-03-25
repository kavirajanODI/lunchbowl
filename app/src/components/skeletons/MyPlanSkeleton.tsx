import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const MyPlanSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View >
        {/* Header */}
        <SkeletonPlaceholder.Item width={120} height={24} borderRadius={6} />

        {/* Plan Card (horizontal) */}
        <SkeletonPlaceholder.Item
          marginTop={20}
          width={wp("90%")}
          height={120}
          borderRadius={12}
        />

        {/* Pagination dots */}
        <SkeletonPlaceholder.Item
          marginTop={10}
          width={60}
          height={10}
          borderRadius={5}
          alignSelf="center"
        />

        {/* Section Header */}
        <SkeletonPlaceholder.Item
          marginTop={30}
          width={180}
          height={20}
          borderRadius={6}
        />

        {/* Calendar block */}
        <SkeletonPlaceholder.Item
          marginTop={20}
          width={wp("90%")}
          height={300}
          borderRadius={12}
        />

        {/* Holidays Section */}
        <SkeletonPlaceholder.Item
          marginTop={30}
          width={140}
          height={20}
          borderRadius={6}
        />
        <SkeletonPlaceholder.Item
          marginTop={15}
          width={wp("90%")}
          height={80}
          borderRadius={12}
        />
        <SkeletonPlaceholder.Item
          marginTop={10}
          width={wp("90%")}
          height={80}
          borderRadius={12}
        />

        {/* Button */}
        <SkeletonPlaceholder.Item
          marginTop={30}
          width={wp("90%")}
          height={50}
          borderRadius={12}
          alignSelf="center"
        />
      </View>
    </SkeletonPlaceholder>
  );
};

export default MyPlanSkeleton;
