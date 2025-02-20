import React, { useEffect, useState } from "react";
import axios from "axios";
import colleges from "../data/colleges.json"; // Import the colleges JSON file
// import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faChevronUp, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Favorites = () => {
    // const navigate = useNavigate();
    const [favoriteCollegeIds, setFavoriteCollegeIds] = useState([]);
    const [favoriteColleges, setFavoriteColleges] = useState([]);
    const [expandedCollege, setExpandedCollege] = useState(null);
    const [bgColors, setBgColors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/favorites?userId=${userId}`);
            setFavoriteCollegeIds(response.data);

            // Filter colleges.json to get only the favorite colleges
            const filteredColleges = colleges.filter(college => response.data.includes(college.id));
            setFavoriteColleges(filteredColleges);

            // Assign random colors
            const colors = {};
            filteredColleges.forEach(college => {
                colors[college.name] = getRandomColor();
            });
            setBgColors(colors);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const toggleFavorite = async (collegeId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/favorites/toggle`, {
                userId: localStorage.getItem("userId"),
                collegeId
            });

            if (response.data.favorite) {
                setFavoriteCollegeIds([...favoriteCollegeIds, collegeId]);
            } else {
                setFavoriteCollegeIds(favoriteCollegeIds.filter(id => id !== collegeId));
            }

            // Update the favorite colleges list
            setFavoriteColleges((prev) => {
                if (response.data.favorite) {
                    return [...prev, colleges.find(college => college.id === collegeId)];
                } else {
                    return prev.filter(college => college.id !== collegeId);
                }
            });

        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const toggleExpand = (collegeId) => {
        setExpandedCollege(expandedCollege === collegeId ? null : collegeId);
    };

    const ClickHereButton = styled.button`
        align-content: center;
        color: #ff5722;
        position: absolute;
        bottom: 5px;
        right: 10px;
        padding: 8px 9px;
        font-size: 22px;
        border: none;
        background-color: transparent;
        border-radius: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        transition: transform 0.2s ease-in-out;
        &:hover {
            color: #e64a19;
            transform: rotate(-10deg);  
        }
`;

const handleClick = (id) => {
    navigate(`/colleges/college?id=${id}`);
  };

    return (
        <FavoritesContainer>
            {/* <Navbar onLogout={() => navigate("/")} /> */}
            <Title>My Favorite Colleges</Title>
            {favoriteColleges.length === 0 ? (
                <Message>No favorite colleges added yet.</Message>
            ) : (
                <List>
                    {favoriteColleges.map((college) => (
                        <ListItem key={college.id} bgColor={bgColors[college.name]} expanded={expandedCollege === college.id}>
                        <Badge onClick={() => toggleFavorite(college.id)}>
                            <FontAwesomeIcon 
                                icon={favoriteCollegeIds.includes(college.id) ? solidHeart : regularHeart} 
                                style={{ color: favoriteCollegeIds.includes(college.id) ? "red" : "gray" }} 
                            />
                        </Badge>
                        <h3>{college.name}</h3>
                        <p>📍 <strong>Location:</strong> {college.location}</p>
                        <p>💰 <strong>Fees:</strong> ₹{college.fees.toLocaleString('en-IN')} per annum</p>
                        
                        <ToggleButton onClick={() => toggleExpand(college.id)} bgColor={bgColors[college.name]}>
                            <FontAwesomeIcon icon={expandedCollege === college.id ? faChevronUp : faChevronDown} />
                        </ToggleButton>
                    
                        <Details expanded={expandedCollege === college.id}>
                            <p>📚 <strong>Courses:</strong> {college.courses?.join(', ')}</p>
                            {/* <p><strong>About:</strong> {college.about}</p>
                            <p><strong>Ranking:</strong> {college.ranking}</p>
                            <p><strong>Established:</strong> {college.established}</p>
                            <p><strong>Description:</strong> {college.description}</p> */}
                    
                            <AdditionalInfo>
                                {/* <p style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                    🏛 <strong>Affiliation</strong> {college.affiliation || 'N/A'}
                                </p>
                                <p style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                    🎓 <strong>Students:</strong> {college.student_population || 'N/A'}
                                </p> */}
                                <p style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                    🌳 <strong>Campus Size:</strong> {college.campus_size ? `${college.campus_size} acres` : 'N/A'}
                                </p>
                                <p style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                    📈 <strong>Placement Rate:</strong> {college.placement_percentage ? `${college.placement_percentage}%` : 'N/A'}
                                </p>
                            </AdditionalInfo>
                            <ClickHereButton onClick={() => handleClick(college.id)}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </ClickHereButton>
                    
                            {/* {college.notable_alumni?.length > 0 && (
                                <p>🌟 <strong>Notable Alumni:</strong> {college.notable_alumni.join(', ')}</p>
                            )} */}
                    
                            {/* {college.website && (
                                <p>🔗 <strong>Website:</strong> <a href={`https://${college.website}`} target="_blank" rel="noopener noreferrer">{college.website}</a></p>
                            )} */}
                        </Details>
                    </ListItem>
                    
                     
                    ))}
                </List>
            )}
        </FavoritesContainer>
    );
};

export default Favorites;

// Generate Random Colors
const getRandomColor = () => {
    const colors = [
        "#ffadad", "#ffda77", "#9bf6ff", "#caffbf", "#ffc6ff", "#fdffb6", "#bdb2ff",
        "#fbc3bc", "#ffebb7", "#a0e7e5", "#d4a5a5", "#f4d160", "#b5e2fa", "#d5b9b2",
        "#a6b1e1", "#eac4d5", "#ffcbf2", "#ffb3c6", "#ffcfdf", "#d4a5ff", "#ffdde1",
        "#a3c4f3", "#ffc8a2", "#f7aef8", "#b9fbc0", "#d0f4de", "#a2d2ff", "#ffafcc",
        "#fde4cf", "#c5e1a5", "#ffcb77", "#c9b6e4"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Styled Components

const FavoritesContainer = styled.div`
    margin: 15vh 5vw;

    @media screen and (max-width: 500px) {
        margin: 15vh 3vw;
    }
`;

const Title = styled.h2`
    text-align: center;
    margin: 20px 0;
    color: #333;
    font-size: 2rem;

    @media screen and (max-width: 500px) {
        font-size: 1.5rem;
    }
`;

const Message = styled.p`
    text-align: center;
    font-size: 1.2rem;
    color: #777;

    @media screen and (max-width: 500px) {
        font-size: 1rem;
    }
`;

const List = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;

    @media screen and (max-width: 500px) {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 15px;
    }
`;

const ListItem = styled.div`
    background: ${(props) => props.bgColor};
    padding: 15px;
    margin-bottom: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    color: #000;
    transition: transform 0.2s ease-in-out;
    height: ${(props) => (props.expanded ? "auto" : "160px")};
    
    &:hover {
        transform: scale(1.02);
    }

    @media screen and (max-width: 500px) {
        padding: 12px;
        height: auto;
        margin-bottom: 15px;
        border-radius: 8px;
    }
`;

const Badge = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
`;

const ToggleButton = styled.button`
    background: ${(props) => props.bgColor};
    border: none;
    box-shadow: 0 6px 8px rgb(0, 0, 0, 0.15);
    border-radius:0px 0px 4px 4px ;
    cursor: pointer;
    font-size: 18px;
    color: #333;
    position: absolute;
    bottom: -20px;
    left: 45%;
`;

const Details = styled.div`
    opacity: ${(props) => (props.expanded ? "1" : "0")};
    max-height: ${(props) => (props.expanded ? "fit-content" : "0")};
    overflow: hidden;
    transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
    margin-bottom: 10px;
`;

const AdditionalInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
`;
