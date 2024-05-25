import Skeleton from 'react-loading-skeleton'
import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import '../css/cardSkeleton.css'

const cardSkeleton = ({ cards }) => {
    return (
        Array(cards).fill(0).map((_, i) => (
                <div className='card-skeleton' key={i}>
                    <div className='left-col'>
                        <Skeleton count={4} style={{ marginBottom: '.6rem' }} />
                    </div>
                    <div className='right-col'> 
                        <Skeleton circle height={100} style={{ marginLeft: '.6rem' }} />

                    </div>
                </div>
            )
        )
    )
}

export default cardSkeleton