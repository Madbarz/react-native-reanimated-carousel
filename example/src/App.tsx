import * as React from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import Carousel from '../../src/index';
import type { ICarouselInstance } from '../../src/types';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

interface DataItem {
    text: string;
    backgroundColor: string;
}

const data: DataItem[] = [
    { text: 'Walter, Wintheiser and Von', backgroundColor: '#ffbb96' },
    { text: 'Herman, Dicki and Wintheiser', backgroundColor: '#ff9c6e' },
    { text: 'Wiza, Borer and Muller', backgroundColor: '#ff7a45' },
    { text: 'Kulas Group', backgroundColor: '#fa541c' },
    { text: 'Rowe, Gerhold and Corkery', backgroundColor: '#d4380d' },
    { text: 'Lang - Doyle', backgroundColor: '#ad2102' },
    { text: "Anderson, Leuschke and O'Keefe", backgroundColor: '#871400' },
];

export default function App() {
    const r = React.useRef<ICarouselInstance | null>(null);
    const progressValue = useSharedValue<number>(0);

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#f1f1f1',
                paddingTop: 100,
            }}
        >
            <View style={{ width: PAGE_WIDTH, height: 240 }}>
                <Carousel
                    defaultIndex={0}
                    ref={r}
                    width={PAGE_WIDTH}
                    parallaxScrollingScale={0.8}
                    data={data}
                    renderItem={({ backgroundColor, text }) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 30 }}>
                                {text}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View
                style={{
                    marginTop: 24,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                }}
            >
                <Button
                    title="Prev"
                    onPress={() => {
                        r.current?.prev();
                    }}
                />
                <Button
                    title="Next"
                    onPress={() => {
                        r.current?.next();
                    }}
                />
            </View>
            <View
                style={{
                    height: 240,
                    alignItems: 'center',
                }}
            >
                <Carousel
                    onProgressChange={(_, absoluteProgress) => {
                        progressValue.value = absoluteProgress;
                    }}
                    mode="parallax"
                    width={window.width}
                    parallaxScrollingScale={0.8}
                    data={data}
                    renderItem={({ backgroundColor, text }) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 20 }}>
                                {text}
                            </Text>
                        </View>
                    )}
                />
                {!!progressValue && (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: 100,
                            alignSelf: 'center',
                        }}
                    >
                        {data.map((_, index) => {
                            return (
                                <PaginationItem
                                    animValue={progressValue}
                                    index={index}
                                    key={index}
                                    length={data.length}
                                />
                            );
                        })}
                    </View>
                )}
            </View>
        </View>
    );
}

const PaginationItem: React.FC<{
    index: number;
    length: number;
    animValue: Animated.SharedValue<number>;
}> = (props) => {
    const { animValue, index, length } = props;
    const width = 20;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View
            style={{
                backgroundColor: 'white',
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
            }}
        >
            <Animated.View
                style={[
                    { borderRadius: 50, backgroundColor: 'tomato', flex: 1 },
                    animStyle,
                ]}
            />
        </View>
    );
};
