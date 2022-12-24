import { useState, useEffect } from "react";
import axios from 'axios'

let eventSource

function App() {

  const [logs, setLogs] = useState([])
  const [id, setId] = useState()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const loggerId = query.get('id') || 1
    setId(loggerId)
    fetchLogsFirst(loggerId)
    fetchLogs(loggerId)
  }, [])

  const fetchLogsFirst = async (id) => {
    try {
      const result = await axios.get(`http://localhost:8000/errors/${id}`)
      setLogs(logs => [...result.data.data, ...logs])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchLogs = (id) => {
    eventSource = new EventSource(`http://localhost:8000/errors/${id}/1`)
    eventSource.onmessage = (event) => {
      setLogs(logs => [JSON.parse(event.data), ...logs])
    }
  }

  const pauseLogs = () => {
    eventSource.close()
  }

  return (
    <div className="container">
      {/* <button className="btn btn-primary" type="button" onClick={fetchLogs}>Fetch Logs</button> */}
      <div><button className="btn btn-primary float-end" type="button" onClick={pauseLogs}>Pause</button></div>
      
      <div style={{ marginTop : "25px" }}>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Error</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {
              logs.map((log,index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{log.error}</td>
                  <td>
                    {new Date(log.createdAt).toLocaleDateString("en-US")} &nbsp;
                    {new Date(log.createdAt).toLocaleTimeString("en-US")}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
