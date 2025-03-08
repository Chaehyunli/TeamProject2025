import React from "react";
import ClubCard from "./ClubCard";

const ClubList = ({ clubs, userClubs}) => {
    console.log("userClubs 데이터:", userClubs);

    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-3 gap-8 p-6"> {/* 반응형 그리드 적용 */}
                {clubs.map((club) => {
                    const isMember = userClubs.some(userClub => userClub.clubId === club.clubId);

                    return <ClubCard key={club.clubId} club={club} isMember={isMember} />;
                })}
            </div>
        </div>
    );
};

export default ClubList;
