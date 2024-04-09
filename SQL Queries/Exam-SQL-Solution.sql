
create table category_master (
	CategoryId int identity(1,1) Primary key  ,

	CategoryName varchar(100) not null ,

	CategoryDescription text, 

	IsActive bit not null,

	CreatedDate date not null
);

create table item_master (
	ItemId int identity(1,1) Primary key,  

	CategoryId int references category_master(CategoryId),

	Itemname varchar(100) Not null ,

	ItemDescription text, 

	Price float Not null ,

	Gst float Not null, 

	IsActive bit Not null, 

	CreatedDate date Not null 
);

create table coupon_master (
	CouponId int identity(1,1) Primary key,

	CouponText varchar(50) Not null,

	DiscountPercentage float Not null, 

	ExpiryDate date Not null 
);

create table order_master(
	OrderId int identity(1,1) Primary key, 

	Deliverycharge int Not null, 

	CouponAmount float Not null, 

	Subtotal float Not null, 

	Total float Not null, 

	Orderdate date Not null 
);

create table order_details(
	OrderDetailsId int identity(1,1) Primary key, 

	OrderId int references order_master(orderID) ,

	ItemId int Not null, 

	Quantity int Not null ,

	Total float Not null 
);
-- store procedure to insert data in category_master
create proc sp_insert_into_category_master @CategoryName varchar(100), @CategoryDescription text, @IsActive bit, @CreatedDate date
as
begin
insert into category_master values (@CategoryName, @CategoryDescription, @IsActive, @CreatedDate);
end
-- store procedure to insert data in item_master
create proc sp_insert_into_item_master @CategoryId int, @Itemname varchar(100),@ItemDescription text,@Price float,@Gst float,@IsActive bit,@CreatedDate date
as 
begin
insert into item_master values (
								@CategoryId,
								@Itemname,
								@ItemDescription,
								@Price,
								@Gst,
								@IsActive,
								@CreatedDate
									);
end;
-- store procedure to insert data in coupon_master
create proc sp_insert_into_coupon_master @CouponText varchar(50), @DiscountPercentage float,@ExpiryDate date as
begin
insert into coupon_master values (@CouponText, @DiscountPercentage, @ExpiryDate);
end;

exec sp_insert_into_category_master 'homecare','',1,'2024-03-30';
exec sp_insert_into_category_master 'childcare','',0,'2024-03-30';
exec sp_insert_into_category_master 'office','',1,'2024-03-30';
exec sp_insert_into_category_master 'personal','',0,'2024-03-30';


exec sp_insert_into_item_master 1,'fan','','600','10',1,'2024-03-29';
exec sp_insert_into_item_master 2,'diper','','50','12',0,'2024-03-29';
exec sp_insert_into_item_master 3,'chair','','200','9',1,'2024-03-29';
exec sp_insert_into_item_master 4,'shirt','','500','5',1,'2024-03-29';
exec sp_insert_into_item_master 1,'water_bottle','','700','2',1,'2024-03-29';
exec sp_insert_into_item_master 2,'monitor','','3500','18',0,'2024-03-29';
exec sp_insert_into_item_master 3,'pant','','1000','10',1,'2024-03-29';

exec sp_insert_into_coupon_master 'holi',20,'2024-03-29';
exec sp_insert_into_coupon_master 'winter-end',50,'2024-04-05';
exec sp_insert_into_coupon_master 'special',20,'2024-04-02';

-- start main store procedure
use Alvish

alter proc sp_create_order @ItemId int, @Quantity int, @Coupon int = null
as
begin
	declare @item_availbale bit,
			@category_available bit,
			@total_price float,
			@delivery_charge float,
			@curr_date date,
			@coupon_date date,
			@is_coupon int,
			@final_amt float,
			@current_order int,
			@coupon_amt float,
			@final_amt_discount float;

	set @item_availbale = (select isactive from item_master where itemid = @ItemId);
	
	set @curr_date = (select format(SYSDATETIME(), 'yyyy-MM-dd'));

	if @Quantity <= 0
		begin
			print 'Quantity can not be 0 or minus'
		end
	else
		begin
			if  @item_availbale is null
		begin
			print 'Item is Not Available'
		end

	else 
		begin
			set @category_available = (select c.isactive from category_master as c inner join item_master as i on i.CategoryId=c.CategoryId where i.itemid = @ItemId);
			if @category_available = ''
				begin
					print 'Category is not Available'
				end
			else 
				begin
					set @total_price = (select dbo.fn_total_calculation(@ItemId,@Quantity));
					
					if @total_price >= 1000
						begin
							set @delivery_charge = 0;
						end
					else if @total_price >= 500 and @total_price <1000
						begin
							set @delivery_charge = 50;
						end
					else
						begin
							set @delivery_charge = 80;
						end

					set @is_coupon = (select couponid from coupon_master where CouponId = @coupon);
					set @final_amt = @total_price + @delivery_charge;

					if @is_coupon is null
						begin
							insert into order_master values (@delivery_charge,0,@final_amt,@final_amt,@curr_date);
							set @current_order = (select top(1) orderid from order_master order by OrderId desc);
							insert into order_details values (@current_order, @ItemId, @Quantity, @final_amt);
						end
					else
						begin
							set @coupon_date = (select ExpiryDate from coupon_master where Couponid = @Coupon);
							if @coupon_date >= @curr_date
								begin
									set @coupon_amt = (select dbo.fn_coupon_discount (@final_amt, @coupon));
									set @final_amt_discount = @final_amt - @coupon_amt;
									insert into order_master values (@delivery_charge,@coupon_amt,@final_amt,@final_amt_discount,@curr_date);
									set @current_order = (select top(1) orderid from order_master order by OrderId desc);
									insert into order_details values (@current_order, @ItemId, @Quantity, @final_amt);
								end
							else
								begin
									insert into order_master values (@delivery_charge,0,@final_amt,@final_amt,@curr_date);
									set @current_order = (select top(1) orderid from order_master order by OrderId desc);
									insert into order_details values (@current_order, @ItemId, @Quantity, @final_amt);
								end	
						end

						select * from order_master where orderid = @current_order;
						select * from order_details where orderid = @current_order;
				end
		end
		end
end

-- execute sp with itemid, quantity, coupon(optional)
exec sp_create_order 1,30,2


select * from category_master
select * from item_master
select * from coupon_master


-- total calculation function

create function fn_total_calculation (@itemid int, @quantity int)
returns float
as
begin
	declare @item_price float;

	set @item_price = (select price from item_master where ItemId = @itemid)

	return @item_price * @quantity
end

-- final coupon discount function

alter function fn_coupon_discount (@final_amt int, @coupon int)
returns float
as
begin
	declare @coupon_per float;

	set @coupon_per = (select DiscountPercentage from coupon_master where CouponId = @coupon);

	return (@final_amt*@coupon_per)/100;
end