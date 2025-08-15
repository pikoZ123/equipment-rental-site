import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [equipment, setEquipment] = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    fetchEquipment()
  }, [])

  async function fetchEquipment() {
    let { data, error } = await supabase.from('equipment').select('*')
    if (!error) setEquipment(data)
  }

  function toggleSelect(item) {
    if (selected.find(e => e.id === item.id)) {
      setSelected(selected.filter(e => e.id !== item.id))
    } else {
      setSelected([...selected, item])
    }
  }

  async function createOrder() {
    const customer = prompt('请输入您的名字:')
    const { error } = await supabase.from('orders').insert([{
      customer,
      items: selected,
      status: '待确认'
    }])
    if (!error) {
      alert('订单已生成')
      setSelected([])
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">器材租赁</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {equipment.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h2 className="font-bold">{item.name}</h2>
            <p>分类: {item.category}</p>
            <p>库存: {item.quantity}</p>
            <p>价格: {item.price}</p>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => toggleSelect(item)}
            >
              {selected.find(e => e.id === item.id) ? '取消选择' : '选择'}
            </button>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold">已选择的器材:</h2>
          <ul>
            {selected.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={createOrder}
          >
            生成器材单
          </button>
        </div>
      )}
    </div>
  )
}
