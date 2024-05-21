import { Marquee } from '@animatereactnative/marquee';
import EText from '@commonComponents/EText';
import { announcementSelector, getAnnouncementsByCategory } from '@reducers/announcementReducer';
import { themeSelector } from '@reducers/theme.reducer';
import { useAppDispatch, useAppSelector } from '@store/index';
import React from 'react';
import { useEffect } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
interface IProps {
    type: 'inner' | 'outer';
}
const Marqueee = (props: IProps) => {
    const { type } = props;
    const dispatch = useAppDispatch();
    const current = useAppSelector((state) => themeSelector(state, 'current'))
    const innerAnnouncement = useAppSelector((state) => announcementSelector(state, 'innerAnnouncement'));
    const outerAnnouncement = useAppSelector((state) => announcementSelector(state, 'outerAnnouncement'));
    const announcement = useAppSelector((state) => announcementSelector(state, 'announcement'));

    useEffect(() => {
        dispatch(getAnnouncementsByCategory(type));
    }, [innerAnnouncement?.id, outerAnnouncement?.id]);

    const containerStyle: ViewStyle = {
        backgroundColor: current.marqueeBg,
        borderBottomColor: current.marqueeBorder,
        borderTopColor: current.marqueeBorder,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: 5
    }

    const textStyle: TextStyle = {
        color: current.marqueeText,
        paddingVertical: 4
    }

    if (type === 'inner') {
        if (announcement.category === 'inner' || (innerAnnouncement && innerAnnouncement.id)) {
            return (
                <View style={{ backgroundColor: current.backgroundColor1 }}>
                    <Marquee style={containerStyle} speed={0.5}>
                        <EText style={textStyle} type='b14'>
                            {announcement?.message !== '' && announcement.category === 'inner'
                                ? announcement?.message
                                : innerAnnouncement && innerAnnouncement.message
                                    ? innerAnnouncement?.message
                                    : null}
                        </EText>
                    </Marquee>
                </View>
            );
        } else {
            return null;
        }
    } else {
        if (announcement.category === 'outer' || (outerAnnouncement && outerAnnouncement.id)) {
            return (
                <Marquee style={containerStyle} speed={0.5}>
                    <EText style={textStyle} type='b16'>
                        {announcement?.message !== '' && announcement.category === 'outer'
                            ? announcement?.message
                            : outerAnnouncement && outerAnnouncement.message
                                ? outerAnnouncement?.message
                                : null}
                    </EText>
                </Marquee>
            );
        } else {
            return null;
        }
    }
};

export default Marqueee;