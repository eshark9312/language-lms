import {EditOutlined} from '@ant-design/icons';
import {Image, Switch, Tooltip} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from 'react';
import {packageApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {numberWithCommas} from '~/utils/functions';
import PackageForm from './PackageForm/PackageForm';

function Package() {
	const [packageList, setPackageList] = useState<IPackage[]>([]);
	const levelOptionList = useRef<IOptionCommon[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		Type: null,
		Level: null,
		formDate: '',
		toDate: '',
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	const typeOptionList = [
		{
			value: 1,
			title: 'Miễn phí',
		},
		{
			value: 2,
			title: 'Cao cấp',
		},
	];
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Level tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Level giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Giá tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Giá giảm dần',
		},
	];
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		refValue.current = {
			...refValue.current,
			pageIndex,
		};
		setFilters({
			...filters,
			pageIndex,
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setFilters({
			...listFieldInit,
			...refValue.current,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		if (dataIndex === 'CreatedOn') {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				...valueSearch,
			});
		} else {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				[dataIndex]: valueSearch,
			});
		}
	};
	// GET DATA IN FIRST TIME
	const formatLevelPackage = (arr: number[]) => {
		if (arr && arr.length) {
			const fmLevelOptionList = arr.map((l) => ({
				title: `Level ${l}`,
				value: l,
			}));
			levelOptionList.current = fmLevelOptionList;
		}
	};
	const fetchPackageList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await packageApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					formatLevelPackage(res.data['ListLevel']);
					setPackageList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	const fetchLevelPackageList = async () => {
		try {
			let res = await packageApi.getAll(filters);
			if (res.status === 200) {
				formatLevelPackage(res.data['ListLevel']);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchPackageList();
	}, [filters]);

	const onChangeStatus = async (
		checked: boolean,
		idRow: number,
		idx: number
	) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let dataChange = {
				ID: idRow,
				Enable: checked,
			};
			let res = await packageApi.update(dataChange);
			if (res.status === 200) {
				const newPackageList = [...packageList];
				const newPackage = {...packageList[idx], Enable: checked};
				newPackageList.splice(idx, 1, newPackage);
				setPackageList(newPackageList);
			}
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	const onUploadImage = async (file) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let formData = new FormData();
			formData.append('File', file);
			const res = await packageApi.uploadImg(formData);
			return res;
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// CREATE

	const onCreatePackage = async (packageItem: {
		Name: string;
		Level: number;
		Type: number;
		Avatar: string;
		Price: string;
		Description: string;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			const {Type, Price} = packageItem;
			const newPackageItem = {
				...packageItem,
				Price: Type === 1 ? 0 : parseInt(Price.replace(/\D/g, '')),
			};
			const res = await packageApi.add(newPackageItem);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
			}
			return res;
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};
	// UPDATE
	const onUpdatePackage = (idx: number) => {
		return async (packageItem: IPackage) => {
			setIsLoading({
				type: 'ADD_DATA',
				status: true,
			});
			try {
				const {Type, Price, Level} = packageItem;
				const newPackageUpdate: IPackage = {
					...packageItem,
					Price: Type === 1 ? 0 : parseInt(Price.toString().replace(/\D/g, '')),
					TypeName: typeOptionList.find((t) => t.value === Type).title || '',
				};
				const res = await packageApi.update(newPackageUpdate);
				if (res.status === 200) {
					const newPackageList = [...packageList];
					newPackageList.splice(idx, 1, newPackageUpdate);
					setPackageList(newPackageList);
					fetchLevelPackageList();
					showNoti('success', res.data.message);
				}
				return res;
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false,
				});
			}
		};
	};
	const columns = [
		{
			title: 'Ảnh bìa',
			dataIndex: 'Avatar',
			render: (url) => {
				return (
					<Image
						width={80}
						height={80}
						src={url}
						title="Ảnh bìa gói bài tập"
						alt="Ảnh bìa gói bài tập"
					/>
				);
			},
		},
		{
			title: 'Tên gói',
			dataIndex: 'Name',
		},
		{
			title: 'Level',
			dataIndex: 'Level',
			render: (level) => `HSK ${level}`,
			...FilterColumn(
				'Level',
				onSearch,
				onResetSearch,
				'select',
				levelOptionList.current
			),
			className: activeColumnSearch === 'Level' ? 'active-column-search' : '',
		},
		{
			title: 'Loại gói',
			dataIndex: 'TypeName',
			...FilterColumn(
				'Type',
				onSearch,
				onResetSearch,
				'select',
				typeOptionList
			),
			className: activeColumnSearch === 'Type' ? 'active-column-search' : '',
		},
		{
			title: 'Giá',
			dataIndex: 'Price',
			render: (price) => (!price ? 0 : numberWithCommas(price)),
		},
		{
			title: 'Ngày tạo gói',
			dataIndex: 'CreatedOn',
			...FilterColumn('CreatedOn', onSearch, onResetSearch, 'date-range'),
			render: (date) => moment(date).format('DD/MM/YYYY'),
			className:
				activeColumnSearch === 'CreatedOn' ? 'active-column-search' : '',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Enable',
			align: 'center',
			filters: [
				{
					text: 'Active',
					value: true,
				},
				{
					text: 'Unactive',
					value: false,
				},
			],
			onFilter: (value, record) => record.Enable === value,
			render: (Enable: boolean, record: IPackage, idx: number) => (
				<>
					<Switch
						checkedChildren="Hiện"
						unCheckedChildren="Ẩn"
						checked={Enable}
						size="default"
						onChange={(checked) => onChangeStatus(checked, record.ID, idx)}
					/>
				</>
			),
		},
		{
			align: 'center',
			render: (packageItem: IPackage, record, idx) => (
				<>
					<Link
						href={{
							pathname: '/package/package-list/package-list-detail/[slug]',
							query: {slug: packageItem.ID},
						}}
					>
						<a className="btn btn-icon edit">
							<Tooltip title="Chi tiết">
								<EditOutlined />
							</Tooltip>
						</a>
					</Link>
					<PackageForm
						isLoading={isLoading}
						isUpdate={true}
						updateObj={packageItem}
						handleUploadImage={onUploadImage}
						handleUpdatePackage={onUpdatePackage(idx)}
					/>
				</>
			),
		},
	];

	return (
		<>
			<PowerTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				Size="package-list-table"
				addClass="basic-header"
				dataSource={packageList}
				columns={columns}
				TitlePage="Danh sách gói bài tập"
				Extra={
					<div className="extra-table">
						<SortBox dataOption={sortOptionList} handleSort={onSort} />
					</div>
				}
				TitleCard={
					<PackageForm
						isLoading={isLoading}
						handleUploadImage={onUploadImage}
						handleCreatePackage={onCreatePackage}
					/>
				}
			/>
		</>
	);
}

export default Package;