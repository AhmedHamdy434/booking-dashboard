-- Enable extension for UUID
create extension if not exists "pgcrypto";

-- ========================
-- SERVICES TABLE
-- ========================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration integer not null
);

-- Enable RLS
alter table services enable row level security;

-- Policies for services
create policy "Allow read services"
on services
for select
using (true);

create policy "Allow insert services"
on services
for insert
with check (true);

-- ========================
-- BOOKINGS TABLE
-- ========================
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  date date not null,
  time text not null,
  created_at timestamp default now()
);

-- Enable RLS
alter table bookings enable row level security;

-- Policies for bookings

-- Users can view only their bookings
create policy "Users can view their bookings"
on bookings
for select
using (auth.uid() = user_id);

-- Users can insert bookings only for themselves
create policy "Users can insert their bookings"
on bookings
for insert
with check (auth.uid() = user_id);




-------------------------------------

-- 1. تفعيل الإضافات
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. جدول البروفايلات (عشان نفرق بين الأدمن والزبون)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
);

-- 3. جدول الخدمات (Services)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration integer NOT NULL, -- بالدقائق
  price numeric DEFAULT 0
);

-- 4. جدول الحلاقين (Barbers)
CREATE TABLE IF NOT EXISTS public.barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean DEFAULT true
);

-- 5. جدول مواعيد عمل الحلاقين (Availability)
CREATE TABLE IF NOT EXISTS public.barber_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  UNIQUE(barber_id, day_of_week)
);

-- 6. جدول الحجوزات (Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  barber_id uuid REFERENCES public.barbers(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ==========================================
-- ضبط الأمان (RLS) والسياسات (Policies)
-- ==========================================

-- تفعيل الـ RLS على كل الجداول
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- تنظيف السياسات القديمة عشان ميبقاش فيه تعارض
DROP POLICY IF EXISTS "Allow read services" ON services;
DROP POLICY IF EXISTS "Allow insert services" ON services;
DROP POLICY IF EXISTS "Users can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert their bookings" ON bookings;

-- 1. سياسات جدول البروفايلات
CREATE POLICY "View own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- 2. سياسات الخدمات (الكل يقرأ، الأدمن فقط يعدل)
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. سياسات الحلاقين والمواعيد (الكل يقرأ، الأدمن فقط يعدل)
CREATE POLICY "Barbers viewable by everyone" ON barbers FOR SELECT USING (true);
CREATE POLICY "Admins can manage barbers" ON barbers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Availability viewable by everyone" ON barber_availability FOR SELECT USING (true);
CREATE POLICY "Admins can manage availability" ON barber_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. سياسات الحجوزات (الزبون يشوف حاجته، الأدمن يشوف الكل)
CREATE POLICY "Users see own bookings" ON bookings FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can insert booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- وظيفة تلقائية (Trigger) لإنشاء بروفايل عند التسجيل
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();