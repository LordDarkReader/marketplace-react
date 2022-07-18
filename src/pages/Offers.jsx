import React, {useEffect, useState} from 'react';
//import {useParams} from 'react-router-dom';
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingsItem from '../components/ListingsItem';

function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListings, setLastFetchedListings] = useState(null);

    //const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings');

                const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(1));

                const querySnap = await getDocs(q);

                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
              setLastFetchedListings(lastVisible);  

                let listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });

                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error('Could not fetch listings' )
            }
        };

        fetchListings();
    }, []);

    // Pagination / Load more
    const onFetchMoreListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');

            const q = query(listingsRef,  where('offer', '==', true), orderBy('timestamp', 'desc'),startAfter(lastFetchedListings) ,limit(1));

            const querySnap = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListings(lastVisible);  

            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });

            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        } catch (error) {
          toast.error('Could not fetch listings' )
        }
      };

    return (
        <div className='category'>
            <header>
                <p className= 'pageHeader'>
                    Offers
                </p>
            </header>
            {loading ? <Spinner/> : listings && listings.length > 0 ?
                (<>
                    <main>
                        <div className='categoryListing'>
                            {listings.map((listings) => (
                                <ListingsItem listing={listings.data} id={listings.id} key={listings.id}/>
                            ))}
                        </div>
                    </main>

                    <br />
                    <br />
                    {lastFetchedListings && (
                        <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
                    )} 
                </>)
                : (<p>There are no current offers</p>)}

        </div>
    )
}

export default Offers
