import type { FC, CSSProperties } from 'react';
import { memo, useState, useEffect } from 'react';
import { Input, Select, DatePicker, InputNumber, Button, Form, message, Grid } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import dayjs from 'dayjs';


const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

// Danh sách các loại phòng
const ROOM_TYPES = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Superior', label: 'Superior' },
  { value: 'Deluxe', label: 'Deluxe' },
  { value: 'Deluxe Partial Ocean View', label: 'Deluxe Partial Ocean View' },
  { value: 'Senior Ocean View', label: 'Senior Ocean View' },
  { value: 'Senior Triple', label: 'Senior Triple' },
  { value: 'Senior Family', label: 'Senior Family' },
  { value: 'Suite', label: 'Suite' },
  { value: 'Apartment', label: 'Apartment' },
];

// Helper function to normalize slug to room type
const normalizeSlugToRoomType = (slug: string): string | null => {
  const normalized = slug.toLowerCase().trim();
  
  // Tìm phòng khớp trực tiếp theo value (lowercase)
  const directMatch = ROOM_TYPES.find(r => r.value.toLowerCase() === normalized);
  if (directMatch) return directMatch.value;
  
  // Tìm theo slug format (dấu gạch nối)
  const slugMatch = ROOM_TYPES.find(r => 
    r.value.toLowerCase().replace(/\s+/g, '-') === normalized
  );
  if (slugMatch) return slugMatch.value;
  
  // Tìm theo từ khóa trong tên
  for (const room of ROOM_TYPES) {
    const roomLower = room.value.toLowerCase();
    // Check nếu slug chứa từ khóa chính của phòng
    if (normalized.includes(roomLower.replace(/\s+/g, '-')) ||
        roomLower.includes(normalized.replace(/-/g, ' '))) {
      return room.value;
    }
  }
  
  // Mapping phụ cho các trường hợp đặc biệt
  const specialMappings: Record<string, string> = {
    'deluxe-partial': 'Deluxe Partial Ocean View',
    'senior-view': 'Senior Ocean View',
    'ocean-view': 'Senior Ocean View',
    'triple': 'Senior Triple',
    'family': 'Senior Family',
  };
  
  for (const [key, value] of Object.entries(specialMappings)) {
    if (normalized.includes(key)) return value;
  }
  
  return null;
};

// Danh sách quốc gia phổ biến
const COUNTRIES = [
  { value: 'Việt Nam', label: 'Việt Nam' },
  { value: 'United States of America', label: 'United States of America' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Korea (Republic of)', label: 'Korea (Republic of)' },
  { value: 'China', label: 'China' },
  { value: 'Australia', label: 'Australia' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'India', label: 'India' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Canada', label: 'Canada' },
];

interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  country: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  adults: number;
  children: number;
  roomType: string;
  roomCount: number;
  otherRequests?: string;
}

interface BookingFormProps {
  className?: string;
}

export const BookingForm: FC<BookingFormProps> = memo(({ className = '' }) => {
  const { primaryColor } = useTheme();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);
  const [form] = Form.useForm<BookingFormData>();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const screens = useBreakpoint();
  const [validationStatus, setValidationStatus] = useState<string>('');

  // Lấy room type từ URL params nếu có
  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam) {
      const mappedRoom = normalizeSlugToRoomType(roomParam);
      if (mappedRoom) {
        form.setFieldValue('roomType', mappedRoom);
      }
    }
  }, [searchParams, form]);

  // Theo dõi validation errors
  const handleFormChange = () => {
    const errors = form.getFieldsError().filter(({ errors }) => errors.length > 0);
    if (errors.length > 0) {
      setValidationStatus(t.missingInfo);
    } else {
      setValidationStatus('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Kết nối API đặt phòng
      
      // Giả lập gửi form
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success(t.success);
      form.resetFields();
    } catch {
      message.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  // Styles - theo mẫu reservation-form
  const containerStyle: CSSProperties = {
    float: 'left',
    width: '100%',
    maxHeight: screens.md ? 272 : 220,
    paddingRight: 16,
    overflowY: 'auto',
    overflowX: 'hidden',
    maxWidth: '100%',
    paddingBottom: 6,
  };

  const labelStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: screens.md ? 13 : 11,
  };

  const inputStyle: CSSProperties = {
    backgroundColor: 'transparent',
    borderColor: 'rgba(236, 197, 109, 0.5)',
    borderWidth: 1,
    borderStyle: 'solid',
    color: '#fff',
    fontSize: 13,
    height: 38,
    padding: '1px 10px 3px 10px',
    outline: 'none',
  };

  const textareaStyle: CSSProperties = {
    ...inputStyle,
    height: 'auto',
    resize: 'none' as const,
  };

  const selectStyle: CSSProperties = {
    width: '100%',
  };

  // Field style cho các form item (width 50%, float left, padding theo mẫu)
  const fieldHalfStyle: CSSProperties = {
    width: screens.md ? '50%' : '100%',
    float: 'left',
    clear: 'none',
    paddingTop: 15,
    paddingRight: screens.md ? 5 : 0,
    margin: 0,
    position: 'relative',
  };

  const fieldFullStyle: CSSProperties = {
    width: '100%',
    float: 'left',
    clear: 'both',
    paddingTop: 12,
    paddingRight: 0,
    margin: 0,
    position: 'relative',
  };

  const submitButtonStyle: CSSProperties = {
    width: '100%',
    height: screens.md ? 40 : 36,
    backgroundColor: '#ecc56d',
    borderColor: '#ecc56d',
    color: '#000',
    fontWeight: 600,
    fontSize: screens.md ? 14 : 12,
    marginTop: 8,
  };

  return (
    <div className={`booking-form ${className}`}>
      <div className="nicescroll-bg" style={containerStyle}>
        {validationStatus && (
          <div style={{ position: 'relative', marginBottom: 16, textAlign: 'right' }}>
            <span style={{ 
              color: '#ecc56d', 
              fontSize: screens.md ? 12 : 10, 
              fontStyle: 'italic',
              whiteSpace: 'nowrap'
            }}>
              {validationStatus}
            </span>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFieldsChange={handleFormChange}
          initialValues={{
            country: 'Việt Nam',
            adults: 1,
            children: 0,
            roomType: 'Standard',
            roomCount: 1,
          }}
          size="small"
          className="reservation-form"
        >
          {/* Họ tên */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="fullName"
              label={<span style={labelStyle}>Họ & tên *</span>}
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              style={{ marginBottom: 0 }}
            >
              <Input 
                placeholder="Họ & tên *" 
                style={inputStyle}
              />
            </Form.Item>
          </div>

          {/* Số điện thoại */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="phone"
              label={<span style={labelStyle}>Số điện thoại *</span>}
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              style={{ marginBottom: 0 }}
            >
              <Input 
                placeholder="Số điện thoại *" 
                style={inputStyle}
              />
            </Form.Item>
          </div>

          {/* Email */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="email"
              label={<span style={labelStyle}>Email *</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input 
                placeholder="Email" 
                style={inputStyle}
              />
            </Form.Item>
          </div>

          {/* Địa chỉ */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="address"
              label={<span style={labelStyle}>Địa chỉ</span>}
              style={{ marginBottom: 0 }}
            >
              <Input 
                placeholder="Địa chỉ" 
                style={inputStyle}
              />
            </Form.Item>
          </div>

          {/* Quốc gia */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="country"
              label={<span style={labelStyle}>Quốc gia</span>}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Quốc gia"
                options={COUNTRIES}
                style={selectStyle}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
              />
            </Form.Item>
          </div>

          {/* Ngày nhận - trả phòng */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="dateRange"
              label={<span style={labelStyle}>Ngày nhận - trả phòng</span>}
              style={{ marginBottom: 0 }}
            >
              <RangePicker
                style={{ width: '100%', ...inputStyle }}
                format="DD/MM/YYYY"
                placeholder={['Nhận phòng', 'Trả phòng']}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                getPopupContainer={() => document.body}
              />
            </Form.Item>
          </div>

          {/* Người lớn */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="adults"
              label={<span style={labelStyle}>Người lớn</span>}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="Người lớn"
                style={{ width: '100%', ...inputStyle }}
              />
            </Form.Item>
          </div>

          {/* Trẻ em */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="children"
              label={<span style={labelStyle}>Trẻ em</span>}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                min={0}
                max={10}
                placeholder="Trẻ em"
                style={{ width: '100%', ...inputStyle }}
              />
            </Form.Item>
          </div>

          {/* Loại phòng */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="roomType"
              label={<span style={labelStyle}>Loại phòng</span>}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Loại phòng"
                options={ROOM_TYPES}
                style={selectStyle}
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
              />
            </Form.Item>
          </div>

          {/* Số lượng phòng */}
          <div style={fieldHalfStyle}>
            <Form.Item
              name="roomCount"
              label={<span style={labelStyle}>Số lượng phòng</span>}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="Số lượng phòng"
                style={{ width: '100%', ...inputStyle }}
              />
            </Form.Item>
          </div>

          {/* Yêu cầu khác */}
          <div style={fieldFullStyle}>
            <Form.Item
              name="otherRequests"
              label={<span style={labelStyle}>Yêu cầu khác</span>}
              style={{ marginBottom: 0 }}
            >
              <TextArea
                placeholder="Yêu cầu khác"
                rows={2}
                style={textareaStyle}
              />
            </Form.Item>
          </div>

          {/* Submit */}
          <div style={{ ...fieldFullStyle, paddingTop: 20 }}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={submitButtonStyle}
              >
                {loading ? t.submitting : t.submit}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .booking-form .nicescroll-bg::-webkit-scrollbar {
          width: 2px;
        }
        .booking-form .nicescroll-bg::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
        }
        .booking-form .nicescroll-bg::-webkit-scrollbar-track {
          background: rgba(251, 228, 150, 0);
        }
        .booking-form .reservation-form {
          overflow: hidden;
        }
        .booking-form .reservation-form::after {
          content: '';
          display: table;
          clear: both;
        }
        .booking-form .ant-form-item {
          margin-bottom: 0;
        }
        /* Ẩn hoàn toàn error messages để không làm gãy layout */
        .booking-form .ant-form-item-explain,
        .booking-form .ant-form-item-explain-error,
        .booking-form .ant-form-item-explain-connected {
          display: none !important;
          height: 0 !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        /* Input fields styling theo mẫu */
        .booking-form .ant-input,
        .booking-form .ant-input-number-input,
        .booking-form textarea.ant-input {
          max-width: 100% !important;
          font-size: 13px !important;
          resize: none;
          width: 100% !important;
          padding: 1px 10px 3px 10px !important;
          background: none !important;
          color: #fff !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          outline: none !important;
          height: 38px !important;
          box-shadow: none !important;
        }
        .booking-form textarea.ant-input {
          height: auto !important;
          min-height: 60px;
        }
        /* Focus state */
        .booking-form .ant-input:focus,
        .booking-form .ant-input-number-input:focus,
        .booking-form textarea.ant-input:focus {
          border-color: rgba(236, 197, 109, 0.8) !important;
          box-shadow: none !important;
        }
        /* Error state */
        .booking-form .ant-form-item-has-error .ant-input,
        .booking-form .ant-form-item-has-error .ant-input-number-input,
        .booking-form .ant-form-item-has-error textarea.ant-input,
        .booking-form .ant-form-item-has-error .ant-select-selector,
        .booking-form .ant-form-item-has-error .ant-picker {
          border-color: rgba(153, 113, 42, 1) !important;
        }
        /* Placeholder styling */
        .booking-form .ant-input::placeholder,
        .booking-form .ant-input-number-input::placeholder,
        .booking-form textarea.ant-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        /* Select styling - Match với choices */
        .booking-form .ant-select {
          cursor: pointer;
        }
        .booking-form .ant-select-selector {
          background: none !important;
          border: none !important;
          height: 38px !important;
          padding: 1px 10px 3px 10px !important;
          box-shadow: none !important;
          min-height: 38px !important;
          line-height: 38px !important;
          display: flex !important;
          align-items: center !important;
          flex-wrap: wrap !important;
        }
        /* Outer wrapper có border giống .choices */
        .booking-form .ant-select {
          max-width: 100% !important;
          font-size: 14px !important;
          width: 100% !important;
          background: none !important;
          color: #fff !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          outline: none;
          height: 38px !important;
          border-radius: 0 !important;
        }
        .booking-form .ant-select-focused {
          border-color: rgba(236, 197, 109, 0.8) !important;
          box-shadow: none !important;
        }
        .booking-form .ant-select-selection-item {
          color: #fff !important;
          line-height: 36px !important;
          padding: 0 !important;
        }
        .booking-form .ant-select-selection-placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
          line-height: 36px !important;
          padding: 0 !important;
        }
        .booking-form .ant-select-arrow {
          color: rgba(255, 255, 255, 0.5);
          inset-inline-end: 11.5px;
        }
        .booking-form .ant-select-arrow .anticon {
          font-size: 10px;
        }
        /* DatePicker styling */
        .booking-form .ant-picker {
          background: none !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          height: 38px !important;
          padding: 1px 10px 3px 10px !important;
          box-shadow: none !important;
        }
        .booking-form .ant-picker-focused {
          border-color: rgba(236, 197, 109, 0.8) !important;
          box-shadow: none !important;
        }
        .booking-form .ant-picker-input > input {
          color: #fff !important;
        }
        .booking-form .ant-picker-input > input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .booking-form .ant-picker-suffix {
          color: rgba(255, 255, 255, 0.5);
        }
        .booking-form .ant-picker-separator {
          color: rgba(255, 255, 255, 0.5);
        }
        /* InputNumber styling */
        .booking-form .ant-input-number {
          background: none !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          height: 38px !important;
          width: 100% !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .booking-form .ant-input-number-input-wrap {
          height: 100%;
        }
        .booking-form .ant-input-number-input {
          height: 36px !important;
          padding: 1px 10px 3px 10px !important;
          border: none !important;
        }
        .booking-form .ant-input-number-focused {
          border-color: rgba(236, 197, 109, 0.8) !important;
          box-shadow: none !important;
        }
        .booking-form .ant-input-number-handler-wrap {
          background: rgba(0, 0, 0, 0.2);
          border-left: 1px solid rgba(236, 197, 109, 0.3);
          opacity: 1;
        }
        .booking-form .ant-input-number-handler {
          border: none;
          height: 50%;
        }
        .booking-form .ant-input-number-handler-up-inner,
        .booking-form .ant-input-number-handler-down-inner {
          color: rgba(255, 255, 255, 0.5);
        }
        .booking-form .ant-input-number-handler:hover .ant-input-number-handler-up-inner,
        .booking-form .ant-input-number-handler:hover .ant-input-number-handler-down-inner {
          color: #ecc56d;
        }
        /* Label styling */
        .booking-form .ant-form-item-label > label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
        }
        /* Error message styling - ẩn hoàn toàn */
        .booking-form .ant-form-item-explain-error {
          display: none !important;
        }
        /* Button styling */
        .booking-form .ant-btn-primary {
          background-color: #ecc56d !important;
          border-color: #ecc56d !important;
          box-shadow: none !important;
        }
        .booking-form .ant-btn-primary:hover {
          background-color: #d4a84a !important;
          border-color: #d4a84a !important;
        }
        .booking-form .ant-btn-primary:active,
        .booking-form .ant-btn-primary:focus {
          background-color: #c89935 !important;
          border-color: #c89935 !important;
        }
      `}</style>
      
      {/* Dropdown list styling - Global scope cho Ant Design Portal */}
      <style>{`
        /* Ẩn "No data" empty state của Select dropdown */
        .ant-select-dropdown .ant-empty,
        .ant-select-dropdown .ant-empty-normal,
        .ant-select-dropdown .ant-empty-small,
        .ant-select-dropdown .ant-select-item-empty,
        .ant-select-item-empty {
          display: none !important;
          height: 0 !important;
          min-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
        /* Select dropdown container - Z-index cao để hiển thị trên cùng */
        .ant-select-dropdown {
          background: black !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          border-radius: 4px !important;
          padding: 0 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
          z-index: 99999 !important;
        }
        /* Dropdown list */
        .ant-select-dropdown .rc-virtual-list,
        .ant-select-dropdown .ant-select-item-option-content {
          max-height: 180px !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        .ant-select-dropdown .rc-virtual-list-holder {
          max-height: 180px !important;
        }
        /* Dropdown items */
        .ant-select-dropdown .ant-select-item {
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 13px !important;
          padding: 8px 12px !important;
          min-height: auto !important;
        }
        .ant-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background-color: rgba(236, 197, 109, 0.15) !important;
        }
        .ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: rgba(236, 197, 109, 0.3) !important;
          color: #ecc56d !important;
          font-weight: 500;
        }
        .ant-select-dropdown .ant-select-item-option-disabled {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        /* Scrollbar cho dropdown */
        .ant-select-dropdown .rc-virtual-list-scrollbar {
          width: 4px !important;
        }
        .ant-select-dropdown .rc-virtual-list-scrollbar-thumb {
          background: rgba(236, 197, 109, 0.5) !important;
        }
        /* DatePicker dropdown - Z-index cao */
        .ant-picker-dropdown {
          z-index: 99999 !important;
        }
        .ant-picker-dropdown .ant-picker-panel-container {
          background: rgba(0, 0, 0, 0.95) !important;
          border: 1px solid rgba(236, 197, 109, 0.5) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
        }
        .ant-picker-dropdown .ant-picker-header,
        .ant-picker-dropdown .ant-picker-content,
        .ant-picker-dropdown .ant-picker-footer {
          background: transparent !important;
        }
        .ant-picker-dropdown .ant-picker-header-view button,
        .ant-picker-dropdown .ant-picker-cell,
        .ant-picker-dropdown .ant-picker-cell-inner {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
          background: #ecc56d !important;
          color: #000 !important;
        }
        .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
          border-color: #ecc56d !important;
        }
        .ant-picker-dropdown .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
          background: rgba(236, 197, 109, 0.2) !important;
        }
        .ant-picker-dropdown .ant-picker-header-super-prev-btn,
        .ant-picker-dropdown .ant-picker-header-prev-btn,
        .ant-picker-dropdown .ant-picker-header-next-btn,
        .ant-picker-dropdown .ant-picker-header-super-next-btn {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .ant-picker-dropdown .ant-picker-header-super-prev-btn:hover,
        .ant-picker-dropdown .ant-picker-header-prev-btn:hover,
        .ant-picker-dropdown .ant-picker-header-next-btn:hover,
        .ant-picker-dropdown .ant-picker-header-super-next-btn:hover {
          color: #ecc56d !important;
        }
      `}</style>
    </div>
  );
});

BookingForm.displayName = 'BookingForm';
