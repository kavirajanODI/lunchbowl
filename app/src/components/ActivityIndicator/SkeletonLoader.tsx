import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ViewStyle, DimensionValue} from 'react-native';

type SkeletonLoaderProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        width={width}
        height={height}
        borderRadius={borderRadius}
        style={style}
      />
    </SkeletonPlaceholder>
  );
};

export default SkeletonLoader;
