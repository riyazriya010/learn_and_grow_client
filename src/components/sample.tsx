'use client'

import ReusableTable from "./table"

const SampleTableUsage = () => {
  const headers = ['Course Name', 'Duration', 'Level', 'Price', 'Actions']
  const data = [
    {courseName: 'Javascript', duration: '2.5 h', level: 'beginner', price: '430'},
    {courseName: 'Node js', duration: '1.5 h', level: 'intermediate', price: '342'}
  ]

  const listCourse = () => {
    console.log('List Course')
  }

  const unListCourse = () => {
    console.log('Un List Course')
  }

  const editCourse = () => {
    console.log('Edit Course')
  }

  const handlers = [
    { handler: listCourse, name: 'List' },
    { handler: unListCourse, name: 'Unlist' },
    { handler: editCourse, name: 'Edit' }
  ];

  return (
    <>
      <h1>Sample table usage</h1>
      <ReusableTable 
      headers={headers}
      data={data}
      handlers={handlers}
      />
    </>
  )
}

export default SampleTableUsage