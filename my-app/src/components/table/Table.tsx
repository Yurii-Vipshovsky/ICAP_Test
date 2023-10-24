import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './Table.css';

interface TableColumn {
  name: string;
}

interface TableData {
  [key: string]: any;
}

function Table(){
  const [data, setData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [editItem, setEditItem] = useState<TableData | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const handlePageChange = async (selectedPage: number) => {
    setCurrentPage(selectedPage);
    await getDataFromServer(selectedPage, itemsPerPage);
  };

  const handleEdit = (item: TableData) => {
    setEditItem(item);
  };

  function transformDate(inputDate: string): string {
    const [day, month, year] = inputDate.split('-');
 
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');

    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    const formattedYear = (century + parseInt(year)).toString();
  
    const transformedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
  
    return transformedDate;
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(event.target.value);
    setItemsPerPage(newValue);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://technical-task-api.icapgroupgmbh.com/api/table/'+editItem?.id+'/', {
        method: 'PATCH',
        body: JSON.stringify(editItem),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(response);
      } else {
        // Обробка помилок
        console.log(response);
        const errorData = await response.json();
        console.log(errorData);
        
      }
    } catch (error) {
      console.error('Помилка під час відправлення запиту:', error);
    }
  };

  const getDataFromServer = async (pageNumber: number, itemsPerPage: number) => {
    try {
      const response = await fetch('https://technical-task-api.icapgroupgmbh.com/api/table/?limit='+itemsPerPage+'&offset='+pageNumber*itemsPerPage);
      const result = await response.json();
      console.log(result);
      for(let i=0;i<result.results.length;++i){
        result.results[i].birthday_date = transformDate(result.results[i].birthday_date);
      }
      setData(result.results);
      setTotalItems(result.count);

      let columns = [];
      let keys = Object.keys(result.results[0]);
      for(let j=0;j<keys.length;++j){
        columns.push({
          name: keys[j]
        })
      }
      setColumns(columns);
    } 
    catch (error) {
      console.error('Помилка під час отримання даних з сервера', error);
    }
  };

  useEffect(() => {
    getDataFromServer(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const changeItem = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string)=>{
    setEditItem({...editItem, [fieldName]:e.target.value })
  }

  return (
    <div>
      {data.length > 0 && columns.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.name}</th>
                ))}
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex}>{item[column.name]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(item)}>Редагувати</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            pageCount={Math.ceil(totalItems / itemsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={(selectedPage) => handlePageChange(selectedPage.selected)}
            containerClassName={'pagination'}
          />
          <div className="dropdown-list-container">
            <h2>Елементів на сторінці:</h2>
            <select value={itemsPerPage || ''} onChange={handleSelectChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          {editItem&&
          <form onSubmit={handleSend}>
              <div key={editItem.id}>
                {columns.map((column) => (
                    <>    
                      {column.name!=='id' && 
                      <>                
                        <label htmlFor={column.name}>{column.name}</label>
                        <input
                          type="text"
                          id={column.name}
                          name={column.name}
                          value={editItem[column.name]}
                          onChange={(e)=>changeItem(e, column.name)}
                        />
                      </>}
                    </>
                ))}
                <td>
                  <button onClick={handleSend}>Зберегти</button>
                </td>
              </div>
          </form>}
        </>
      ) : (
        <p>Завантаження даних...</p>
      )}
    </div>
  );
};

export default Table;