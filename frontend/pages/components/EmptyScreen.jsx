"use client"

import { Empty } from 'antd';

export default function EmptyScreen() {
    return (
        <div className="h-150 flex items-center justify-center">
            <Empty
                styles={{
                    image: {
                        color: 'red',
                    },
                    description: {
                        color: "#494D54"
                    }
                }}
                description="No data"
                image={Empty.PRESENTED_IMAGE_DEFAULT} 
            />
        </div>
    );
}