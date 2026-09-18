/**
 * ============================================================================
 * MINI-SHOP-API - ENDPOINTS DOCUMENTATION
 * ============================================================================
 *
 * Base URL: http://localhost:3000
 *
 * AUTHENTICATION:
 *   - JWT Bearer token via Authorization header: "Bearer <token>"
 *   - Token expiry: 900s (15 min)
 *   - Algorithm: HS256
 *   - Token is stored server-side in user.token column and validated on each request
 *
 * GLOBAL GUARDS:
 *   JwtAuthGuard  -> All routes require JWT unless @Public() is used
 *   RolesGuard    -> Checks @roles(...) metadata; skipped for @Public()
 *
 * GLOBAL PIPE:
 *   ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
 *
 * DATABASE: PostgreSQL (Supabase) via TypeORM
 * Entities use UUID primary keys and created_at / updated_at timestamps
 *
 * ============================================================================
 * ARCHITECTURE: MODULES
 * ============================================================================
 *
 * | Module         | Prefix       | Auth            | Roles      |
 * |----------------|--------------|-----------------|------------|
 * | AppModule      | /            | Public          | -          |
 * | AuthModule     | /auth        | Mixed           | -          |
 * | UsersModule    | /users       | Protected       | user/admin |
 * | CategoriesMod. | /categories  | Protected       | -          |
 * | ProductsModule | /products    | Mixed           | -          |
 * | CartModule     | /cart        | Protected       | -          |
 * | OrdersModule   | /orders      | Protected       | user/admin |
 * | PaymentsModule | /payments    | Protected       | user/admin |
 * | ReviewsModule  | /reviews     | Protected       | user/admin |
 *
 * ============================================================================
 * ENTITY RELATIONSHIPS
 * ============================================================================
 *
 *   User  1──1  Cart       1──N  CartItem     N──1  Product
 *   User  1──N  Order      1──N  OrderItem    N──1  Product
 *   User  1──N  Review     N──1  Product
 *   User  1──N  Address
 *   Category 1──N Product
 *   Order  1──1  Payment
 *
 *   All foreign keys: CASCADE on delete/update
 *
 * ============================================================================
 */

// ============================================================================
// SECTION 1: TYPES & INTERFACES
// ============================================================================

/** JWT payload decoded from Bearer token */
interface JwtPayload {
  sub: string;   // user UUID
  role: 'user' | 'admin';
}

/** Auth header required for protected routes */
interface AuthHeader {
  Authorization: `Bearer ${string}`;
}

// ============================================================================
// SECTION 2: APP
// ============================================================================

interface AppEndpoints {
  /**
   * GET /
   *
   * @Public  Yes (no JWT required)
   * @Roles   None
   *
   * @Response 200 { string } "Hello World!"
   */
  getHello: {
    method: 'GET';
    path: '/';
    params: null;
    query: null;
    body: null;
    headers: null;
    response: string;
  };
}

// ============================================================================
// SECTION 3: AUTH
// ============================================================================

interface AuthEndpoints {
  /**
   * POST /auth/register
   *
   * @Public  Yes (no JWT required)
   * @Roles   None
   *
   * @Body RegisterDto
   *   - email:    string (required, valid email format)
   *   - password: string (required, IsStrongPassword: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol)
   *   - fullName: string (optional)
   *
   * @Response 201 { string } "Registration success"
   * @Errors   409 ConflictException "Email already in use"
   */
  register: {
    method: 'POST';
    path: '/auth/register';
    params: null;
    query: null;
    body: {
      email: string;
      password: string;
      fullName?: string;
    };
    headers: null;
    response: string;
  };

  /**
   * POST /auth/login
   *
   * @Public  Yes (no JWT required)
   * @Roles   None
   *
   * @Body LoginDto
   *   - email:    string (required, valid email format)
   *   - password: string (required, IsStrongPassword: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol)
   *
   * @Response 201 {
   *   token: string;  // JWT token (sub=userId, role=role, expiresIn=900s)
   *   user: {
   *     id: string;       // UUID
   *     email: string;
   *     fullName?: string;
   *   }
   * }
   * @Errors   401 UnauthorizedException "Invalid credentials"
   */
  login: {
    method: 'POST';
    path: '/auth/login';
    params: null;
    query: null;
    body: {
      email: string;
      password: string;
    };
    headers: null;
    response: {
      token: string;
      user: {
        id: string;
        email: string;
        fullName?: string;
      };
    };
  };

  /**
   * POST /auth/logout
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * The userId is extracted from the JWT payload via @currentUser('sub').
   * Server-side token is set to null (invalidating the token).
   *
   * @Response 201 { message: string } "Logged out. Discard your access token client-side."
   * @Errors   401 UnauthorizedException
   */
  logout: {
    method: 'POST';
    path: '/auth/logout';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      message: string;
    };
  };
}

// ============================================================================
// SECTION 4: USERS
// ============================================================================

interface UsersEndpoints {
  /**
   * POST /users
   *
   * @Public  No (JWT required)
   * @Roles   ['admin']  <- @roles('admin')
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Body CreateUserDto
   *   - email:    string (required, valid email format)
   *   - password: string (required, IsStrongPassword)
   *   - fullName: string (optional)
   *
   * @Response 201 {
   *   id: string;       // UUID
   *   email: string;
   *   fullName?: string;
   *   role: 'user';     // always 'user' on creation
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors
   *   409 ConflictException "Email already in use"
   *   403 ForbiddenException "Access forbidden" (if not admin)
   */
  create: {
    method: 'POST';
    path: '/users';
    params: null;
    query: null;
    body: {
      email: string;
      password: string;
      fullName?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      email: string;
      fullName?: string;
      role: 'user';
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /users
   *
   * @Public  No (JWT required)
   * @Roles   ['admin']  <- @roles('admin')
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Response 200 Array<User>  (all users, password field excluded by select:false)
   * @Errors   403 ForbiddenException "Access forbidden" (if not admin)
   */
  findAll: {
    method: 'GET';
    path: '/users';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      email: string;
      fullName?: string;
      role: 'user' | 'admin';
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /users/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked in service)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, path parameter)
   *
   * @Query None
   *
   * @Logic: Non-admin users can only access their own profile (userId === id).
   *
   * @Response 200 User
   * @Errors
   *   403 ForbiddenException "Access forbidden" (not owner and not admin)
   *   404 NotFoundException "User not found"
   */
  findOne: {
    method: 'GET';
    path: '/users/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      email: string;
      fullName?: string;
      role: 'user' | 'admin';
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /users/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked in service)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, path parameter)
   *
   * @Body UpdateUserDto (PartialType<CreateUserDto>)
   *   - email?:    string (valid email format)
   *   - password?: string (IsStrongPassword)
   *   - fullName?: string
   *
   * @Logic: If password is changed, token is set to null (forces re-login).
   *
   * @Response 200 User (updated user)
   * @Errors
   *   403 ForbiddenException "Access forbidden"
   *   404 NotFoundException "User not found"
   */
  update: {
    method: 'PATCH';
    path: '/users/:id';
    params: { id: string };
    query: null;
    body: {
      email?: string;
      password?: string;
      fullName?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      email: string;
      fullName?: string;
      role: 'user' | 'admin';
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /users/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked in service)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, path parameter)
   *
   * @Response 200 DeleteResult { raw: any; affected: number }
   * @Errors
   *   403 ForbiddenException "Access forbidden"
   *   404 NotFoundException "User not found"
   */
  remove: {
    method: 'DELETE';
    path: '/users/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };

  /**
   * POST /users/address
   *
   * @Public  No (JWT required)
   * @Roles   None (uses userId from token)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Body AddressDto
   *   - street?: string (optional)
   *   - city:    string (required)
   *   - country: string (required)
   *   - zip?:    string (optional)
   *
   * @Response 201 Address {
   *   id: string;
   *   userId: string;
   *   street?: string;
   *   city?: string;
   *   country?: string;
   *   zip?: string;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors   404 NotFoundException "User not found"
   */
  addAddress: {
    method: 'POST';
    path: '/users/address';
    params: null;
    query: null;
    body: {
      street?: string;
      city: string;
      country: string;
      zip?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      street?: string;
      city?: string;
      country?: string;
      zip?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

// ============================================================================
// SECTION 5: CATEGORIES
// ============================================================================

interface CategoriesEndpoints {
  /**
   * POST /categories
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Body CreateCategoryDto
   *   - name: string (required)
   *   - slug: string (required, must be unique)
   *
   * @Response 201 Category {
   *   id: string;
   *   name: string;
   *   slug: string;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors
   *   409 ConflictException "This product slug is already in use"
   */
  create: {
    method: 'POST';
    path: '/categories';
    params: null;
    query: null;
    body: {
      name: string;
      slug: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /categories
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Response 200 Array<Category>
   */
  findAll: {
    method: 'GET';
    path: '/categories';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /categories/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe, used as slug in the service)
   *
   * @Note: Despite the param being named :id, the service queries by slug.
   *
   * @Response 200 Category {
   *   id, name, slug, createdAt, updatedAt,
   *   products: Product[]  // eagerly loaded
   * }
   * @Errors   404 NotFoundException "Category <slug> not found."
   */
  findOne: {
    method: 'GET';
    path: '/categories/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      name: string;
      slug: string;
      products: Array<{
        id: string;
        categoryId: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
      }>;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /categories/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Body UpdateCategoryDto (PartialType<CreateCategoryDto>)
   *   - name?: string
   *   - slug?: string
   *
   * @Response 200 Category
   * @Errors   404 NotFoundException "Category not found."
   */
  update: {
    method: 'PATCH';
    path: '/categories/:id';
    params: { id: string };
    query: null;
    body: {
      name?: string;
      slug?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /categories/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Response 200 DeleteResult { raw: any; affected: number }
   * @Errors   404 NotFoundException "Category not found."
   */
  remove: {
    method: 'DELETE';
    path: '/categories/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };
}

// ============================================================================
// SECTION 6: PRODUCTS
// ============================================================================

interface ProductsEndpoints {
  /**
   * POST /products/:categoryId
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - categoryId: string (UUID, ParseUUIDPipe)
   *
   * @Body CreateProductDto
   *   - name:        string (required)
   *   - description: string (required)
   *   - price:       number (required, decimal max 2 decimals, min 0, max 99999999.99)
   *   - stock:       number (required, integer, min 0)
   *
   * @Response 201 Product {
   *   id: string;
   *   categoryId: string;
   *   name: string;
   *   description: string;
   *   price: number;
   *   stock: number;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors   404 NotFoundException "Category not found"
   */
  create: {
    method: 'POST';
    path: '/products/:categoryId';
    params: { categoryId: string };
    query: null;
    body: {
      name: string;
      description: string;
      price: number;
      stock: number;
    };
    headers: AuthHeader;
    response: {
      id: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /products
   *
   * @Public  Yes (@Public() decorator)
   * @Roles   None
   *
   * @Note: No JWT required despite global JwtAuthGuard.
   *
   * @Response 200 Array<Product>
   */
  findAll: {
    method: 'GET';
    path: '/products';
    params: null;
    query: null;
    body: null;
    headers: null;  // @Public - no JWT required
    response: Array<{
      id: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /products/:id
   *
   * @Public  Yes (@Public() decorator)
   * @Roles   None
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Response 200 Product
   * @Errors   404 NotFoundException "Product not found"
   */
  findOne: {
    method: 'GET';
    path: '/products/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: null;  // @Public - no JWT required
    response: {
      id: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /products/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Body UpdateProductDto (PartialType<CreateProductDto>)
   *   - name?:        string
   *   - description?: string
   *   - price?:       number
   *   - stock?:       number
   *
   * @Response 200 Product
   * @Errors   404 NotFoundException "Product not found"
   */
  update: {
    method: 'PATCH';
    path: '/products/:id';
    params: { id: string };
    query: null;
    body: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
    };
    headers: AuthHeader;
    response: {
      id: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /products/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Response 200 DeleteResult { raw: any; affected: number }
   * @Errors   404 NotFoundException "Product not found"
   */
  remove: {
    method: 'DELETE';
    path: '/products/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };
}

// ============================================================================
// SECTION 7: CART
// ============================================================================

interface CartEndpoints {
  /**
   * POST /cart/:productId
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - productId: string (UUID, ParseUUIDPipe)
   *
   * @Body CreateCartItemDto
   *   - quantity: number (required, integer)
   *
   * @Logic (inside a transaction):
   *   1. Find or create the user's Cart (one cart per user)
   *   2. Verify product exists
   *   3. Check stock: quantity <= product.stock
   *   4. Create CartItem linked to the Cart and Product
   *   5. Decrement product stock by quantity
   *
   * @Response 201 CartItem {
   *   id: string;
   *   cartId: string;
   *   productId: string;
   *   quantity: number;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors
   *   404 NotFoundException "Product not found"
   *   400 BadRequestException "Product stock isn't enough"
   */
  create: {
    method: 'POST';
    path: '/cart/:productId';
    params: { productId: string };
    query: null;
    body: {
      quantity: number;
    };
    headers: AuthHeader;
    response: {
      id: string;
      cartId: string;
      productId: string;
      quantity: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /cart
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Note: Returns ALL carts in the database (potential issue - not scoped to user).
   *
   * @Response 200 Array<Cart>
   */
  findAll: {
    method: 'GET';
    path: '/cart';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /cart/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe) -> Cart ID
   *
   * @Logic: Checks cart ownership (cart.userId === JWT.sub).
   *
   * @Response 200 Cart
   * @Errors
   *   404 NotFoundException "Cart not found"
   *   403 ForbiddenException "You are not the owner of this cart"
   */
  findOne: {
    method: 'GET';
    path: '/cart/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /cart/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe) -> CartItem ID
   *
   * @Body UpdateCartItemDto (PartialType<CreateCartItemDto>)
   *   - quantity?: number (integer)
   *
   * @Logic: Checks ownership via cartItem.cart.userId === JWT.sub.
   *         Returns the parent Cart after update (not the CartItem).
   *
   * @Response 200 Cart (parent cart)
   * @Errors
   *   404 NotFoundException "Cart item not found"
   *   403 ForbiddenException "You are not the owner of this cart"
   */
  update: {
    method: 'PATCH';
    path: '/cart/:id';
    params: { id: string };
    query: null;
    body: {
      quantity?: number;
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /cart/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe) -> CartItem ID
   *
   * @Logic: Checks ownership via cartItem.cart.userId === JWT.sub.
   *
   * @Response 200 DeleteResult { raw: any; affected: number }
   * @Errors
   *   404 NotFoundException "Cart item not found"
   *   403 ForbiddenException "You are not the owner of this cart"
   */
  remove: {
    method: 'DELETE';
    path: '/cart/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };
}

// ============================================================================
// SECTION 8: ORDERS
// ============================================================================

interface OrdersEndpoints {
  /**
   * POST /orders
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Body CreateOrderDto
   *   - status:     'pending' | 'cancelled' | 'completed'  (default: 'pending')
   *   - total:      number (required, decimal)
   *   - orderItems: CreateOrderItemDto[] (required, array of):
   *       - productId: string (UUID, required)
   *       - quantity:  number (integer, required)
   *       - unitPrice: number (decimal, required)
   *
   * @Note: Order is created with cascade-saved orderItems.
   *
   * @Response 201 Order {
   *   id: string;
   *   userId: string;      // note: userId may be empty/null as it's not in the DTO
   *   status: 'pending' | 'cancelled' | 'completed';
   *   total: number;
   *   orderItems: OrderItem[];
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   */
  create: {
    method: 'POST';
    path: '/orders';
    params: null;
    query: null;
    body: {
      status?: 'pending' | 'cancelled' | 'completed';
      total: number;
      orderItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
      }>;
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      status: 'pending' | 'cancelled' | 'completed';
      total: number;
      orderItems: Array<{
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        createdAt: Date;
        updatedAt: Date;
      }>;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /orders
   *
   * @Public  No (JWT required)
   * @Roles   None (but admin sees all orders, user sees only own)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Logic:
   *   - If role === 'admin': returns all orders
   *   - If role === 'user':  returns only orders where userId === JWT.sub
   *
   * @Response 200 Array<Order>
   */
  findAll: {
    method: 'GET';
    path: '/orders';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      userId: string;
      status: 'pending' | 'cancelled' | 'completed';
      total: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /orders/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Logic: Non-admin users can only view their own orders.
   *
   * @Response 200 Order
   * @Errors
   *   404 NotFoundException "Order not found"
   *   403 ForbiddenException "You are not the owner of this order"
   */
  findOne: {
    method: 'GET';
    path: '/orders/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      status: 'pending' | 'cancelled' | 'completed';
      total: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /orders/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Body UpdateOrderDto
   *   - status: 'completed' (only valid value)
   *
   * @Logic: Only pending orders can be updated. Owner check enforced.
   *
   * @Response 200 Order
   * @Errors
   *   404 NotFoundException "Order not found"
   *   403 ForbiddenException "You are not the owner of this order"
   *   400 BadRequestException "Only pending orders can be updated"
   */
  update: {
    method: 'PATCH';
    path: '/orders/:id';
    params: { id: string };
    query: null;
    body: {
      status: 'completed';
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      status: 'pending' | 'cancelled' | 'completed';
      total: number;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * NOTE: DELETE /orders/:id does NOT exist in the controller.
   * Order cancellation is handled via:
   *   - DELETE /payments/:id (cancels the payment AND the associated order)
   *   - Or directly via OrdersService.cancelOrder() (internal, no controller endpoint)
   */
}

// ============================================================================
// SECTION 9: PAYMENTS
// ============================================================================

interface PaymentsEndpoints {
  /**
   * POST /payments/:cartId
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - cartId: string (UUID, ParseUUIDPipe)
   *
   * @Body CreatePaymentDto
   *   - status: 'pending' | 'succeeded' | 'failed'  (default: 'pending')
   *   - method: 'card' | 'paypal' | 'crypto'  (required)
   *
   * @Logic (orchestrated):
   *   1. Find cart with cartItems and products loaded
   *   2. Verify cart ownership (cart.userId === JWT.sub)
   *   3. Calculate total = sum(cartItem.quantity * cartItem.product.price)
   *   4. Create Order via OrdersService with status 'pending', computed total,
   *      and orderItems derived from cartItems
   *   5. Create Payment linked to the Order with amount = order.total
   *   6. Delete all CartItems from the cart
   *   7. Return saved Payment
   *
   * @Response 201 Payment {
   *   id: string;
   *   orderId: string;
   *   amount: number;
   *   status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
   *   method: 'card' | 'paypal' | 'crypto';
   *   transactionId?: string;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors
   *   404 NotFoundException "Order not found" (actually "Cart not found")
   *   403 ForbiddenException "You are not the owner of this order"
   */
  create: {
    method: 'POST';
    path: '/payments/:cartId';
    params: { cartId: string };
    query: null;
    body: {
      status?: 'pending' | 'succeeded' | 'failed';
      method: 'card' | 'paypal' | 'crypto';
    };
    headers: AuthHeader;
    response: {
      id: string;
      orderId: string;
      amount: number;
      status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
      method: 'card' | 'paypal' | 'crypto';
      transactionId?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /payments
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Note: Returns ALL payments (not scoped to user - potential issue).
   *
   * @Response 200 Array<Payment>
   */
  findAll: {
    method: 'GET';
    path: '/payments';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      orderId: string;
      amount: number;
      status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
      method: 'card' | 'paypal' | 'crypto';
      transactionId?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /payments/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked via payment.order.userId)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Logic: Non-admin users can only view payments linked to their own orders.
   *
   * @Response 200 Payment {
   *   ...Payment,
   *   order: Order  // relation loaded
   * }
   * @Errors
   *   404 NotFoundException "Payment not found"
   *   403 ForbiddenException "You are not the owner of this payment"
   */
  findOne: {
    method: 'GET';
    path: '/payments/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      orderId: string;
      amount: number;
      status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
      method: 'card' | 'paypal' | 'crypto';
      transactionId?: string;
      order: {
        id: string;
        userId: string;
        status: 'pending' | 'cancelled' | 'completed';
        total: number;
        createdAt: Date;
        updatedAt: Date;
      };
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /payments/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Body CreatePaymentDto (NOTE: uses CreatePaymentDto, not UpdatePaymentDto)
   *   - status: 'pending' | 'succeeded' | 'failed'  (default: 'pending')
   *   - method: 'card' | 'paypal' | 'crypto'  (required)
   *
   * @Logic: Cannot update succeeded or cancelled payments.
   *
   * @Response 200 Payment
   * @Errors
   *   404 NotFoundException "Payment not found"
   *   403 ForbiddenException "You are not the owner of this payment"
   *   400 BadRequestException "Invalid payment"
   */
  update: {
    method: 'PATCH';
    path: '/payments/:id';
    params: { id: string };
    query: null;
    body: {
      status?: 'pending' | 'succeeded' | 'failed';
      method: 'card' | 'paypal' | 'crypto';
    };
    headers: AuthHeader;
    response: {
      id: string;
      orderId: string;
      amount: number;
      status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
      method: 'card' | 'paypal' | 'crypto';
      transactionId?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /payments/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Logic:
   *   1. Find payment with order relation loaded
   *   2. Verify ownership or admin role
   *   3. Cannot cancel succeeded or cancelled payments
   *   4. Cancel the associated Order via OrdersService.cancelOrder()
   *      (which in a transaction: restores stock for all order items,
   *       sets order status to 'cancelled')
   *   5. Update payment status to 'cancelled'
   *
   * @Response 200 UpdateResult { raw: any; affected: number }
   * @Errors
   *   404 NotFoundException "Payment not found"
   *   403 ForbiddenException "You are not the owner of this payment"
   *   400 BadRequestException "Invalid payment"
   *   404 NotFoundException "Order not found" (during order cancellation)
   *   400 BadRequestException "Only pending orders can be cancelled"
   */
  cancel: {
    method: 'DELETE';
    path: '/payments/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };
}

// ============================================================================
// SECTION 10: REVIEWS
// ============================================================================

interface ReviewsEndpoints {
  /**
   * POST /reviews/:productId
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - productId: string (UUID, ParseUUIDPipe)
   *
   * @Body CreateReviewDto
   *   - rating:  number (required, integer)
   *   - comment: string (optional)
   *
   * @Logic: Verifies both user and product exist before creating.
   *
   * @Response 201 Review {
   *   id: string;
   *   userId: string;
   *   productId: string;
   *   rating?: number;
   *   comment?: string;
   *   createdAt: Date;
   *   updatedAt: Date;
   * }
   * @Errors
   *   404 NotFoundException "User not found"
   *   404 NotFoundException "Product not found"
   */
  create: {
    method: 'POST';
    path: '/reviews/:productId';
    params: { productId: string };
    query: null;
    body: {
      rating: number;
      comment?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      productId: string;
      rating?: number;
      comment?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * GET /reviews
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Response 200 Array<Review>
   */
  findAll: {
    method: 'GET';
    path: '/reviews';
    params: null;
    query: null;
    body: null;
    headers: AuthHeader;
    response: Array<{
      id: string;
      userId: string;
      productId: string;
      rating?: number;
      comment?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };

  /**
   * GET /reviews/:id
   *
   * @Public  No (JWT required)
   * @Roles   None
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Response 200 Review
   * @Errors   404 NotFoundException "Review not found"
   */
  findOne: {
    method: 'GET';
    path: '/reviews/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      productId: string;
      rating?: number;
      comment?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * PATCH /reviews/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Body UpdateReviewDto (PartialType<CreateReviewDto>)
   *   - rating?:  number
   *   - comment?: string
   *
   * @Logic: Only the review owner can update.
   *
   * @Response 200 Review
   * @Errors
   *   404 NotFoundException "Review not found"
   *   403 ForbiddenException "You are not the owner of this review"
   */
  update: {
    method: 'PATCH';
    path: '/reviews/:id';
    params: { id: string };
    query: null;
    body: {
      rating?: number;
      comment?: string;
    };
    headers: AuthHeader;
    response: {
      id: string;
      userId: string;
      productId: string;
      rating?: number;
      comment?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  /**
   * DELETE /reviews/:id
   *
   * @Public  No (JWT required)
   * @Roles   None (ownership or admin checked)
   *
   * @Headers Authorization: Bearer <token>
   *
   * @Params
   *   - id: string (UUID, ParseUUIDPipe)
   *
   * @Logic: Owner can delete own reviews; admin can delete any review.
   *
   * @Response 200 DeleteResult { raw: any; affected: number }
   * @Errors
   *   404 NotFoundException "Review not found"
   *   403 ForbiddenException "You are not the owner of this review"
   */
  remove: {
    method: 'DELETE';
    path: '/reviews/:id';
    params: { id: string };
    query: null;
    body: null;
    headers: AuthHeader;
    response: { raw: unknown; affected: number };
  };
}

// ============================================================================
// SECTION 11: CONSOLIDATED ENDPOINT SUMMARY TABLE
// ============================================================================

/**
 * ============================================================================
 * COMPLETE ENDPOINT REFERENCE TABLE
 * ============================================================================
 *
 * | #  | Method | Path                     | Auth     | Roles  | Body DTO              | Response           |
 * |----|--------|--------------------------|----------|--------|-----------------------|---------------------|
 * | 1  | GET    | /                        | Public   | -      | -                     | string              |
 * | 2  | POST   | /auth/register           | Public   | -      | RegisterDto           | string              |
 * | 3  | POST   | /auth/login              | Public   | -      | LoginDto              | {token, user}       |
 * | 4  | POST   | /auth/logout             | JWT      | -      | -                     | {message}           |
 * | 5  | POST   | /users                   | JWT      | admin  | CreateUserDto         | User                |
 * | 6  | GET    | /users                   | JWT      | admin  | -                     | User[]              |
 * | 7  | GET    | /users/:id               | JWT      | - *    | -                     | User                |
 * | 8  | PATCH  | /users/:id               | JWT      | - *    | UpdateUserDto         | User                |
 * | 9  | DELETE | /users/:id               | JWT      | - *    | -                     | DeleteResult        |
 * | 10 | POST   | /users/address           | JWT      | -      | AddressDto            | Address             |
 * | 11 | POST   | /categories              | JWT      | -      | CreateCategoryDto     | Category            |
 * | 12 | GET    | /categories              | JWT      | -      | -                     | Category[]          |
 * | 13 | GET    | /categories/:id          | JWT      | -      | -                     | Category + Products |
 * | 14 | PATCH  | /categories/:id          | JWT      | -      | UpdateCategoryDto     | Category            |
 * | 15 | DELETE | /categories/:id          | JWT      | -      | -                     | DeleteResult        |
 * | 16 | POST   | /products/:categoryId    | JWT      | -      | CreateProductDto      | Product             |
 * | 17 | GET    | /products                | Public   | -      | -                     | Product[]           |
 * | 18 | GET    | /products/:id            | Public   | -      | -                     | Product             |
 * | 19 | PATCH  | /products/:id            | JWT      | -      | UpdateProductDto      | Product             |
 * | 20 | DELETE | /products/:id            | JWT      | -      | -                     | DeleteResult        |
 * | 21 | POST   | /cart/:productId         | JWT      | -      | CreateCartItemDto     | CartItem            |
 * | 22 | GET    | /cart                    | JWT      | -      | -                     | Cart[]              |
 * | 23 | GET    | /cart/:id                | JWT      | - *    | -                     | Cart                |
 * | 24 | PATCH  | /cart/:id                | JWT      | - *    | UpdateCartItemDto     | Cart                |
 * | 25 | DELETE | /cart/:id                | JWT      | - *    | -                     | DeleteResult        |
 * | 26 | POST   | /orders                  | JWT      | -      | CreateOrderDto        | Order               |
 * | 27 | GET    | /orders                  | JWT      | - **   | -                     | Order[]             |
 * | 28 | GET    | /orders/:id              | JWT      | - **   | -                     | Order               |
 * | 29 | PATCH  | /orders/:id              | JWT      | - *    | UpdateOrderDto        | Order               |
 * | 30 | POST   | /payments/:cartId        | JWT      | - *    | CreatePaymentDto      | Payment             |
 * | 31 | GET    | /payments                | JWT      | -      | -                     | Payment[]           |
 * | 32 | GET    | /payments/:id            | JWT      | - **   | -                     | Payment + Order     |
 * | 33 | PATCH  | /payments/:id            | JWT      | - *    | CreatePaymentDto      | Payment             |
 * | 34 | DELETE | /payments/:id            | JWT      | - **   | -                     | UpdateResult        |
 * | 35 | POST   | /reviews/:productId      | JWT      | -      | CreateReviewDto       | Review              |
 * | 36 | GET    | /reviews                 | JWT      | -      | -                     | Review[]            |
 * | 37 | GET    | /reviews/:id             | JWT      | -      | -                     | Review              |
 * | 38 | PATCH  | /reviews/:id             | JWT      | - *    | UpdateReviewDto       | Review              |
 * | 39 | DELETE | /reviews/:id             | JWT      | - **   | -                     | DeleteResult        |
 *
 * *  = ownership checked in service (userId must match JWT.sub, unless admin)
 * ** = ownership OR admin role checked in service
 *
 * ============================================================================
 */

// ============================================================================
// SECTION 12: COMPLETE ENDPOINT MAP (for programmatic use)
// ============================================================================

const ENDPOINTS = {
  app: {
    getHello: { method: 'GET', path: '/', auth: false },
  },
  auth: {
    register:  { method: 'POST', path: '/auth/register', auth: false },
    login:     { method: 'POST', path: '/auth/login', auth: false },
    logout:    { method: 'POST', path: '/auth/logout', auth: true },
  },
  users: {
    create:     { method: 'POST',    path: '/users',           auth: true, roles: ['admin'] },
    findAll:    { method: 'GET',     path: '/users',           auth: true, roles: ['admin'] },
    findOne:    { method: 'GET',     path: '/users/:id',       auth: true, ownership: true },
    update:     { method: 'PATCH',   path: '/users/:id',       auth: true, ownership: true },
    remove:     { method: 'DELETE',  path: '/users/:id',       auth: true, ownership: true },
    addAddress: { method: 'POST',    path: '/users/address',   auth: true },
  },
  categories: {
    create:  { method: 'POST',   path: '/categories',      auth: true },
    findAll: { method: 'GET',    path: '/categories',      auth: true },
    findOne: { method: 'GET',    path: '/categories/:id',  auth: true },
    update:  { method: 'PATCH',  path: '/categories/:id',  auth: true },
    remove:  { method: 'DELETE', path: '/categories/:id',  auth: true },
  },
  products: {
    create:  { method: 'POST',   path: '/products/:categoryId', auth: true },
    findAll: { method: 'GET',    path: '/products',             auth: false },
    findOne: { method: 'GET',    path: '/products/:id',         auth: false },
    update:  { method: 'PATCH',  path: '/products/:id',         auth: true },
    remove:  { method: 'DELETE', path: '/products/:id',         auth: true },
  },
  cart: {
    create:  { method: 'POST',   path: '/cart/:productId', auth: true },
    findAll: { method: 'GET',    path: '/cart',            auth: true },
    findOne: { method: 'GET',    path: '/cart/:id',        auth: true, ownership: true },
    update:  { method: 'PATCH',  path: '/cart/:id',        auth: true, ownership: true },
    remove:  { method: 'DELETE', path: '/cart/:id',        auth: true, ownership: true },
  },
  orders: {
    create:  { method: 'POST',   path: '/orders',      auth: true },
    findAll: { method: 'GET',    path: '/orders',      auth: true, adminScope: true },
    findOne: { method: 'GET',    path: '/orders/:id',  auth: true, ownership: true },
    update:  { method: 'PATCH',  path: '/orders/:id',  auth: true, ownership: true },
  },
  payments: {
    create:  { method: 'POST',   path: '/payments/:cartId', auth: true, ownership: true },
    findAll: { method: 'GET',    path: '/payments',         auth: true },
    findOne: { method: 'GET',    path: '/payments/:id',     auth: true, adminScope: true },
    update:  { method: 'PATCH',  path: '/payments/:id',     auth: true, ownership: true },
    cancel:  { method: 'DELETE', path: '/payments/:id',     auth: true, adminScope: true },
  },
  reviews: {
    create:  { method: 'POST',   path: '/reviews/:productId', auth: true },
    findAll: { method: 'GET',    path: '/reviews',            auth: true },
    findOne: { method: 'GET',    path: '/reviews/:id',        auth: true },
    update:  { method: 'PATCH',  path: '/reviews/:id',        auth: true, ownership: true },
    remove:  { method: 'DELETE', path: '/reviews/:id',        auth: true, adminScope: true },
  },
} as const;

export type { ENDPOINTS };
