import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore';
import {db} from '../firebase.config';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Spinner from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


function Slider() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q);
    
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
          
            setListings(listings);
            setLoading(false);
        }

        fetchListings();
    }, []);
    
    if (loading) {
        return <Spinner/>
    }

    if (listings.length === 0) {
        return <>pusto</>
    }


    // return listings && (
    //     <>
    //         <p className='exploreHeading'>Recommended</p>
    //         <Swiper slidesPerView={1} pagination={{clickable: true}}>
    //             {listings.map(({data, id}) => {
    //                 <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
    //                     <div id="dupa" style={{background: `url(${data.imgUrls[0]}) center no-repeat, `}} className='swiperSlideDiv'>
    //                         <p className='SwiperSlideText'>{data.name}</p>   
    //                     </div>            
    //                 </SwiperSlide>          
    //             })}
    //         </Swiper>
    //     </>
    // );

    // https://firebasestorage.googleapis.com/v0/b/house-marketplace-fire.appspot.com/o/image%2FSgOeiRiX1ZZcuUswS2lD9Xy1Ft42-The_Red_House.jpg-466e2257-35a9-487c-854f-dd621320603e?alt=media&token=c8df730c-0439-4f1f-a7b7-708f38ced570

    return (
        <>
            <p className='exploreHeading'>Recommended</p>
            <Swiper slidesPerView={1} pagination={{clickable: true}}>
               
                    <SwiperSlide key={1} onClick={() => navigate(`/category/rent/1`)}>
                        {/* <img src='../assets/jpg/rentCategoryImage.jpg' className='swiperSlideDiv'/>  */}
                        <img style={{width: '100%', height: '50%'}} src='https://firebasestorage.googleapis.com/v0/b/house-marketplace-fire.appspot.com/o/image%2FSgOeiRiX1ZZcuUswS2lD9Xy1Ft42-The_Red_House.jpg-466e2257-35a9-487c-854f-dd621320603e?alt=media&token=c8df730c-0439-4f1f-a7b7-708f38ced570
' className='swiperSlideDiv'/> 
                    </SwiperSlide>          
                
            </Swiper>
        </>
    );
}

export default Slider