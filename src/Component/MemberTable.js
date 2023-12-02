import axios from 'axios'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'
import { Form} from './Form';

function MemberTable() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState("")
  const [filterMember, setFilterMember] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null);

  const getMembers = async () => {
    try {
      const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      setMembers(response.data)
      setFilterMember(response.data)

    } catch (error) {
      console.log(error)
    }

  }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Roll",
      selector: (row) => row.role,
    },
    {
      name: "Action",
      cell: (row) => <> <button className='button-8 ' onClick={() => {
        setRowToEdit(row.id)
        setModalOpen(true)
      }}>Edit</button>

        <button style={{ "marginLeft": '10px' }} className='button-8 ' onClick={() => {
          console.log("row", row)
          setMembers(
            filterMember.filter(m => m.id !== row.id)
          )
        }}
        >Delete</button>
      </>

    },



  ]


  const handleSelect = async (state) => {
    await setSelectedRows(state.selectedRows)
   
  }

  const deleteAll = () => {

    const idToRemove = selectedRows.map(obj => obj.id)
    const filterSecondArray = filterMember.filter(obj => !idToRemove.includes(obj.id))
    setMembers(filterSecondArray)

  }

  const handleSubmit = (newRow) => {
    console.log("newtoe", rowToEdit)
    rowToEdit === null
      ? setMembers([members, newRow])
      : setMembers(
        members.map((currRow) => {
          if (currRow.id !== rowToEdit) return currRow;

          return newRow;
        })
      );
   
  };

  useEffect(() => {
    getMembers()
  }, [])

  useEffect(() => {
    const result = members.filter(member => {
      return member.name.toLowerCase().match(search.toLocaleLowerCase())
    })
    setFilterMember(result)
  }, [search])

  useEffect(() => {
    setFilterMember(members)

  }, [members])


  return (
    <>
      <DataTable
        columns={columns}
        data={filterMember}
        pagination
        fixedHeader
        fixedHeaderScrollHeight='535px'
        selectableRows
        selectableRowsHighlight
        selectableRowsVisibleOnly={true}
        onSelectedRowsChange={handleSelect}
        highlightOnHover
        subHeader
        subHeaderComponent={
          <>
          <input type='text'
            className='input'
            placeholder='Filter by name...'
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
          />

            <button style={{ "marginLeft": 'auto' }} className='button-8 ' onClick={deleteAll}>Delete all selected Rows</button>
          </>
        }
        subHeaderAlign='left'
      />

      {modalOpen && <Form
        closeModal={() => {
          setModalOpen(false)
          setRowToEdit(null)
        }}

        onSubmit={handleSubmit}
        defaultValue={rowToEdit !== null && members.find(obj => obj.id == rowToEdit)}
      />}
    </>
  )
}

export default MemberTable