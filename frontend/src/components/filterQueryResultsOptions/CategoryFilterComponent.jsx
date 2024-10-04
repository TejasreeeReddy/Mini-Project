import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
  const { categories } = useSelector((state) => state.getCategories);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const categoryRef = useRef([])
  const selectCategory = (e, category, index) => {
    setCategoriesFromFilter(items => {
      return { ...items, [category.name]: e.target.checked }
    })
    var selectedMainCategory = category.name.split("/")[0];
 
    var allCategories = categoryRef.current.map((_, id) => {
      return { name: categories[id].name, index: id }

    });
 
    var indexesOfMainCategory = allCategories.reduce((acc, item) => {
      var cat = item.name.split("/")[0];
      if (selectedMainCategory === cat) {
        acc.push(item.index)
      }
      return acc
    }, [])

    if (e.target.checked) {
      setSelectedCategories((old) => [...old, "cat"])
      categoryRef.current.map((_, index) => {
        if (!indexesOfMainCategory.includes(index)) {
          categoryRef.current[index].disabled = true;
          return ""
        }
      })
    } else {
      setSelectedCategories((old) => {
        var a = [...old];
        a.pop();
        if (a.length === 0) {
          window.location.href = "/product-list"
        }
        return a
      })
      categoryRef.current.map((_, index2) => {
        if (allCategories.length === 1) {
          if (index2 !== index) {
            categoryRef.current[index2].disabled = false
          }
        } else if (selectedCategories.length === 1) {
          categoryRef.current[index2].disabled = false
          return ""
        }
      })
    }
  }

  return (
    <div>
      <span className='fw-bold'>Category:</span>
      <Form>
        {categories.map((category, index) => (
          <div key={index} className="mb-3">
            <Form.Check type="checkbox" id={`check-api2-${index}`}>
              <Form.Check.Input ref={(el) => (categoryRef.current[index] = el)} type="checkbox" isValid onChange={(e) => selectCategory(e, category, index)} />
              <Form.Check.Label style={{ cursor: "pointer" }}>{category.name}</Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </div>
  )
}

export default CategoryFilterComponent