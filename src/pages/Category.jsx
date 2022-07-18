import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingsItem from '../components/ListingsItem';

function Category() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListings, setLastFetchedListings] = useState(null);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
          try {
              const listingsRef = collection(db, 'listings');

              const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(2));

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
    }, [params.categoryName]);

    // Pagination /Load more
    const onFetchMoreListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');

            const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'),startAfter(lastFetchedListings) ,limit(2));

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
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
                </p>
            </header>
            {loading ? <Spinner/> : listings && listings.length > 0 ?
                (<>
                    <main>
                        <div className='categoryListing'>
                            {listings.map((listing) => (
                                <ListingsItem listing={listing.data} id={listing.id} key={listing.id}/>
                            ))}
                        </div>
                    </main>

                    <br />
                    <br />
                    {lastFetchedListings && (
                        <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
                    )}                
                                
                </>)
                : (<p>No listings for {params.categoryName}</p>)}

        </div>
    )
}

export default Category
