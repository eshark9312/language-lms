import {DatePicker, Form, Popover, Select} from 'antd';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import { Roles } from "~/lib/roles/listRoles";
import { useForm } from "react-hook-form";
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

const { RangePicker } = DatePicker; 

const FilterStaffSalaryTable = (props:any) => {
	const {Option} = Select;
	function handleChange(value) {
		console.log(`selected ${value}`);
	}

	function onChange(date, dateString) {
		console.log(date, dateString);
	}

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted },
	} = useForm();

	const onSubmit = handleSubmit((data: any) => {
		// console.log(data);
		props._onFilter(data);
	});

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit}>
				<div className="row">
					<div className="col-md-12">
						<Form.Item label="Role">
							<Select
								className="style-input"
								placeholder="Chọn role"
								onChange={(value) => setValue("RoleID", value)}
								allowClear={true}
							>
								{Roles.map((item) => (
									<Option key={item.id} value={item.id}>{item.RoleName}</Option>
								))}

								<Option value="disabled" disabled>
									Disabled
								</Option>
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item label="Modified Date">
							<RangePicker
								format={dateFormat}
								className="style-input"
								allowClear={true}
								onChange={(value, dateStrings) => {setValue("fromDate", dateStrings[0]); setValue("toDate", dateStrings[1])}}
							/>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button className="btn btn-primary" style={{marginRight: '10px'}} onClick={onSubmit}>
								Tìm kiếm
							</button>
							{/* <button className="btn btn-success">Export</button> */}
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	);

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					overlayClassName="filter-popover"
				>
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	);
};

export default FilterStaffSalaryTable;
