import React, {useContext, useEffect, useRef, useCallback} from "react";  
import {Link} from "react-router-dom";   //useEffect 사이드 이팩트가 발생할 때 사용
import { AuthContext } from "../context/AuthContext";
import {ImageContext} from "../context/ImageContext";
import "./ImageList.css";
import Image from "./image";

const ImageList = () => {
    const {images,  isPublic, setIsPublic, imageLoading, imageError, setImageUrl } = useContext(ImageContext);
    const [me] = useContext(AuthContext);
    const elementRef = useRef(null);

    const loaderMoreImages = useCallback(() => {
        if(images.length === 0 || !imageLoading) return;
        const lastImageId = images[images.length - 1]._id;
        setImageUrl(`${isPublic ? "" : "/users/me"}/images?lastid=${lastImageId}`);
    },[images, imageLoading, isPublic, setImageUrl]);

    useEffect(()=> {
        if(!elementRef.current) return;
        const observer = new IntersectionObserver(([entry])=>{
            console.log('intersection', entry.isIntersecting);
            if(entry.isIntersecting) loaderMoreImages();
        });
        observer.observe(elementRef.current);
        return () => observer.disconnect();
    },[loaderMoreImages]);

    //console.log({images});
    const imgList = images.map((image, index) => (
        <Link 
            key={image.key} 
            to={`/images/${image._id}`} 
            ref={index+5 === images.length ? elementRef : undefined}
        >
            <Image imageUrl={`https://d5swhvagmr7nv.cloudfront.net/w140/${image.key}`} />
            {/* <img 
                alt=""
                src={`https://image-upload-tutorial-smlee.s3.ap-northeast-2.amazonaws.com/w140/${image.key}`}
            /> */}
        </Link>
    ));
  
    return (
        <div>
            <h3 style={{display: "inline-block", marginRight: 10}}>Image List({(isPublic ? "공개" : "개인")} 사진)</h3>
            {me && <button onClick={() => setIsPublic(!isPublic)}>
                {(isPublic ? "개인" : "공개") + "사진 보기"}
                </button>}
                <div className="image-list-container">{imgList}</div>
                {imageError && <div>Error...</div>}
                {imageLoading ? (<div>Loading..</div>) : (<button onClick={loaderMoreImages}> Load More Images</button>)}
        </div>
    )};

export default ImageList;