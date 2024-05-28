import './index.scoped.scss';
import React, { useState, useEffect, useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Space, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { IMap } from '@common/services/api_d/base';
import { HttpService } from '@@/services/http.service';

const <%= pageName %> = () => {
	const http = HttpService;
	const actionRef = useRef<ActionType>();
	const history = useHistory();

	const columns: ProColumns<IMap>[] = [
		{
			title: '组织名称',
			dataIndex: 'organizationName',
			order: 5
		},
		{
			title: '组织类型',
			dataIndex: 'organizationTypeName',
			hideInSearch: true
		},
		{
			title: '组织类型',
			dataIndex: 'organizationType',
			order: 4,
			hideInTable: true,
			valueType: 'select',
			request: async () => {
				return [
					{
						label: 'test',
						value: 1
					}
				];
			}
		},
		{
			title: '组织负责人',
			dataIndex: 'organizationPrincipalName',
			width: 150,
			search: false
		},
		{
			title: '事件类型',
			dataIndex: 'eventType',
			order: 1,
			valueEnum: {
				0: '新增账号',
				1: '数商入驻',
				2: '数商信息变更'
			}
		},
		{
			title: '审核状态',
			dataIndex: 'auditState',
			order: 3,
			valueEnum: {
				0: { status: 'warning', text: '待审核' },
				1: { status: 'success', text: '审核通过' },
				2: { status: 'error', text: '审核拒绝' }
			}
		},
		{
			title: '申请时间',
			dataIndex: 'applyTime',
			valueType: 'dateRange',
			search: {
				transform: (value: number[]) => {
					if (value) {
						return {
							startTime: value[0],
							endTime: value[1]
						};
					}
				}
			},
			order: 2,
			render: (text, record: IMap) => record.applyTime
		},
		{
			title: '审核时间',
			dataIndex: 'auditTime',
			search: false
		},
		{
			title: '操作',
			valueType: 'option',
			key: 'option',
			fixed: 'right',
			render: (text, record: IMap, _, action) => {
				return (
					<Space>
						<Typography.Link>审核</Typography.Link>
						<Typography.Link>详情</Typography.Link>
					</Space>
				);
			}
		}
	];

	const fetchList = async (params: IMap) => {
		params.startPage = params.current;
		delete params.current;

		if (params.auditState) {
			params.auditState = +params.auditState;
		}
		const [err, res] = await http('POST', '/path/xxx', params);

		if (err) {
			return { success: false };
		}

		return { data: res.records, total: res.total, success: true };
	};

	return (
		<div className="custom-width-picker">
			<ProTable<IMap>
				columns={columns}
				actionRef={actionRef}
				cardBordered
				request={async (params, sort, filter) => {
					return fetchList(params);
				}}
				columnsState={{
					persistenceKey: 'pro-table-singe-demos',
					persistenceType: 'localStorage',
					defaultValue: {
						option: { fixed: 'right', disable: true }
					}
				}}
				rowKey="id"
				search={{
					labelWidth: 'auto'
				}}
				options={false}
				pagination={{
					pageSize: 10
					// onChange: (page) => console.log(page)
				}}
				scroll={{ x: 1600 }}
				dateFormatter="string"
				headerTitle="列表详情"
				// toolBarRender={() => [
				//     <Button
				//         key="button"
				//         // icon={<PlusOutlined />}
				//         onClick={() => {
				//             setOpen(true);
				//             editId.current = undefined;
				//         }}
				//         type="primary"
				//     >
				//         新增
				//     </Button>
				// ]}
			/>
		</div>
	);
}

export default <%= pageName %>;
