import React from 'react'
import { Button } from 'react-bootstrap'

const RemoveFromCartComponent = ({ orderCreated, productId, quantity, price, removeFromCartHandler = false }) => {

    return (
        <Button
            disabled={orderCreated}
            type="button"
            variant="secondary"
            onClick={removeFromCartHandler ? () => removeFromCartHandler(productId, quantity, price) : undefined}
        >
            <i className="bi bi-trash"></i>
        </Button>
    )
}

export default RemoveFromCartComponent