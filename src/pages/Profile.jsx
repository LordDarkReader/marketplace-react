import React, {useState, useEffect} from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {Link, useNavigate} from 'react-router-dom';
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, limit} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingsItem from '../components/ListingsItem';

/**
 * @return {string}
 */
function Profile() {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(10));
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            });
            
            setListings(listings);
            setLoading(false);
        }
        fetchUserListings();
    }, [auth.currentUser.uid]);

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    });
    const {name, email} = formData;
    const onSubmit = async () => {

        try {
            if (auth.currentUser.displayName !== name) {
                await  updateProfile(auth.currentUser, {
                    displayName: name
                });

                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    name
                });
                toast.success('Profile details updated')
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    };

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId));
            const updatedListings = listings.filter((listing) => listing.id !== listingId);
            setListings(updatedListings);
            toast.success('Successfuly deleted listing');
        }
    }

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My profile</p>
                <button className='logOut' type='button' onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText' >Personal Details</p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState);
                    }}>{changeDetails ? 'done' : 'change'}</p>
                </div>
                <div className='profileCard'>
                    <form>
                        <input type='text'
                               id='name'
                               className={!changeDetails ? 'profileName' : 'profileNameActive'}
                               disabled={!changeDetails}
                               value={name}
                               onChange={onChange}
                        />
                        <input type='email'
                               id='email'
                               className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                               disabled={!changeDetails}
                               value={email}
                               onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listings' className='createListing'>
                    <img src={homeIcon} alt='home'/>
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt='arrowRight'/>
                </Link>

                {!loading && listings?.length > 0 &&(
                    <>
                        <p className='listingsText'>Your Listings</p>
                        <ul className='listingsList'>
                            {listings.map((listing) => (
                                <ListingsItem key={listing.id} listing={listing.data} id={listing.id} onEdit={() => onEdit(listing.id)}  onDelete={() => onDelete(listing.id)}/>
                            ))}
                        </ul>
                    </>
                )}

                
            </main>
        </div>
    )
}

export default Profile
