import React from 'react'
import { Form } from 'react-bootstrap'

const AttributesFilterComponent = ({ attrsFilter, setAttrsFromFilter }) => {

  return (
    <div>
      {attrsFilter && attrsFilter.length > 0 && attrsFilter.map((filter, index) => (
        <div key={index} className='mb-3'>
          <Form.Label><b>{filter.key}</b></Form.Label>
          {filter.value.map((valueForKey, index2) => (
            <Form.Check
              key={index2}
              type="checkbox"
              id="default-checkbox"
              label={valueForKey}
              onChange={(e) => {
                setAttrsFromFilter(filters => {
                  // console.log(filters.key)
                  if (filters.length === 0) {
                    return [{ key: filter.key, values: [valueForKey] }]
                  }
                  let index = filters.findIndex((item) => item.key === filter.key);
                  if (index === -1) {
                    return [...filters, { key: filter.key, values: [valueForKey] }]
                  }
                  if (e.target.checked) {
                    filters[index].values.push(valueForKey)
                    let unique = [...new Set(filters[index].values)];
                    filters[index].values = unique;
                    return [...filters]
                  }
                  let valuesWithoutUnChecked = filters[index].values.filter((val) => val !== valueForKey);
                  filters[index].values = valuesWithoutUnChecked;
                  if (valuesWithoutUnChecked.length > 0) {
                    return [...filters]
                  } else {
                    let filtersWithoutOneKey = filters.filter((item) => item.key !== filter.key);
                    return [...filtersWithoutOneKey]
                  }

                })
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AttributesFilterComponent