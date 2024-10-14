'use client'

import { useState, useEffect } from 'react'
import { Card, Input, Button, Table, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  id: number
  content: string
  createdAt: string
}

export default function Home() {
  const [content, setContent] = useState<string>('')
  const [dataSource, setDataSource] = useState<DataType[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch('/api/notes')
      const notes = await response.json()
      setDataSource(notes)
    }
    fetchNotes()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleSaveClick = async () => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    const data = await response.json()
    setDataSource(data)

    setContent('')
  }

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`/api/notes?id=${id}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    setDataSource(data)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'created_at',
      dataIndex: 'createdAt',
      width: '20%',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    },
    {
      title: 'content',
      dataIndex: 'content',
      width: '75%',
    },
    {
      width: '5%',
      render: (record: DataType) => (
        <Button danger onClick={() => handleDeleteClick(record.id)}>
          Delete
        </Button>
      ),
    },
  ]

  const centeredStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }

  return (
    <div style={centeredStyle}>
      <Card title='Note' style={{ width: 800 }}>
        <Row>
          <Col span={16}>
            <Input placeholder='content' value={content} onChange={handleInputChange} />
          </Col>
          <Col span={7} offset={1}>
            <Button type='primary' onClick={handleSaveClick}>
              Save
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
          }}
          style={{ marginTop: 20 }}
        />
      </Card>
    </div>
  )
}
