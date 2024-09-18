import { useState, useRef, useEffect } from "react";

export default function Popup({ collection, closePopup }) {
  const [mainImg, setMainImg] = useState(collection?.photos[0]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (collection) {
      setMainImg(collection.photos[0]);
    }
  }, [collection]);

  const handleClose = () => {
    closePopup();
  }

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  }

  const changeImg = (img) => {
    if (mainImg !== img) {
      setMainImg(img);
    }
  }

  return (
    <div className={`overlay ${!collection ? 'animated' : ''}`} onClick={handleClickOutside}>
      <div className="modal" ref={modalRef}>
        <div className="modal__content">
          <span className="icon" onClick={handleClose}>
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_429_11083)">
                <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#242424" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_429_11083">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </span>
          <h2>{collection?.name}</h2>
          <img className="main-image" src={mainImg} alt="Item" />
          <div className="image-wrapper">
            {collection?.photos.map(img => (
              <img key={img} className="mini-image" src={img} alt="Item" onClick={() => changeImg(img)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
