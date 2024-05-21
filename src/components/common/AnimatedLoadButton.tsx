import { useAppSelector } from '@store/index';
import { themeSelector } from '@store/reducers/theme.reducer';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedLoadButton = ({ loading, onPress }: { loading: boolean, onPress: () => void }) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (loading) {
            spin();
        } else {
            spinValue.stopAnimation();
            spinValue.setValue(0);
        }
    }, [loading]);

    const spin = () => {
        spinValue.setValue(0);
        Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
    };

    const spinAnimation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const current = useAppSelector((state) => themeSelector(state, "current"));

    return (
        <View>
            <Animated.View
                style={{
                    transform: [{ rotate: spinAnimation }]
                }}
            >
                <MaterialCommunityIcons name='autorenew' color={current.primary} size={25} onPress={onPress} />
            </Animated.View>
        </View>
    );
};

export default AnimatedLoadButton;




// import React, { useState, useEffect, useRef } from 'react';
// import { View, Animated, Easing, Button } from 'react-native';

// const RotatingView = () => {
//     const [isSpinning, setIsSpinning] = useState(false);
//     const spinValue = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         if (isSpinning) {
//             console.log("-----in start")
//             spin();
//         } else {
//             console.log("-----in stop")
//             spinValue.stopAnimation();
//         }
//     }, [isSpinning]);

//     const spin = () => {
//         spinValue.setValue(0);
//         Animated.timing(
//             spinValue,
//             {
//                 toValue: 1,
//                 duration: 4000,
//                 easing: Easing.linear,
//                 useNativeDriver: true
//             }
//         ).start(() => {
//             if (isSpinning) {
//                 spin();
//             }
//         });
//     };

//     const spinAnimation = spinValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg']
//     });

//     const toggleSpin = () => {
//         setIsSpinning((prev) => !prev);
//     };

//     return (
//         <View>
//             <Animated.View
//                 style={{
//                     width: 100,
//                     height: 100,
//                     backgroundColor: 'blue',
//                     transform: [{ rotate: spinAnimation }]
//                 }}
//             />
//             <Button
//                 title={isSpinning ? 'Stop' : 'Start'}
//                 onPress={toggleSpin}
//             />
//         </View>
//     );
// };

// export default RotatingView;
