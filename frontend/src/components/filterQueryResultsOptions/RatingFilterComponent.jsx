import React from 'react'
import { Form } from 'react-bootstrap'
import { Rating } from 'react-simple-star-rating'

const RatingFilterComponent = ({ setRatingFromFilter }) => {
  return (
    <div>
      <span className='fw-bold'>Rating</span>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index}>
          <Form.Check type='checkbox' id={`check-api-${index}`}>
            <Form.Check.Input type='checkbox' isValid onChange={(e) => setRatingFromFilter((items) => { return { ...items, [5 - index]: e.target.checked } })} />
            <Form.Check.Label style={{ cursor: "pointer" }}>
              <Rating readonly size={20} initialValue={5 - index} />
            </Form.Check.Label>
          </Form.Check>
        </div>
      ))}
    </div>
  )
}

export default RatingFilterComponent