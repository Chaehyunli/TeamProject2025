import {useEffect, useState} from "react";
import {getParticularUserProfile} from "../api/userApi";

const UserNameFine = ({articles}) => {
    const [userName, setUserName] = useState('');
    const userId = articles.author.authorId;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await getParticularUserProfile(userId);

                console.log('userProfile: ', userProfile);
                console.log('userName', userProfile.data.name);
                setUserName(userProfile.data.name);
            } catch (error) {
                console.log("유저 이름 조회 실패: ", error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    return(
        <div>
            <span>{userName}</span>
        </div>
    )
};

export default UserNameFine;