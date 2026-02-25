#!/usr/bin/env python3
"""
İbed Backend API Testing Script
Tests all API endpoints for the İbed catalog website
"""

import requests
import sys
import json
from datetime import datetime

class IbedAPITester:
    def __init__(self, base_url="https://ibed-products.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, passed, details="", response_time=None):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if passed else "FAIL", 
            "details": details,
            "response_time": response_time
        }
        self.test_results.append(result)
        
        status_icon = "✅" if passed else "❌"
        print(f"{status_icon} {name}: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            passed = response.status_code == 200
            details = f"Status: {response.status_code}"
            if passed:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root", passed, details, response.elapsed.total_seconds())
            return passed
        except Exception as e:
            self.log_test("API Root", False, f"Error: {str(e)}")
            return False

    def test_get_all_products(self):
        """Test getting all products"""
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            passed = response.status_code == 200
            
            if passed:
                products = response.json()
                details = f"Status: {response.status_code}, Count: {len(products)}"
                
                # Verify product structure
                if len(products) > 0:
                    product = products[0]
                    required_fields = ['id', 'name', 'category', 'description', 'features', 'image_url']
                    missing_fields = [field for field in required_fields if field not in product]
                    if missing_fields:
                        passed = False
                        details += f", Missing fields: {missing_fields}"
                    else:
                        # Check category values
                        categories = {p.get('category') for p in products}
                        expected_categories = {'yatak', 'baza'}
                        if not categories.issubset(expected_categories):
                            unexpected = categories - expected_categories
                            details += f", Unexpected categories: {unexpected}"
                        details += f", Categories: {list(categories)}"
                
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("Get All Products", passed, details, response.elapsed.total_seconds())
            return passed, response.json() if passed else []
            
        except Exception as e:
            self.log_test("Get All Products", False, f"Error: {str(e)}")
            return False, []

    def test_get_products_by_category(self):
        """Test category filtering"""
        results = []
        
        for category in ['yatak', 'baza']:
            try:
                response = requests.get(f"{self.api_url}/products?category={category}", timeout=10)
                passed = response.status_code == 200
                
                if passed:
                    products = response.json()
                    # Verify all products are in the requested category
                    wrong_category = [p for p in products if p.get('category') != category]
                    if wrong_category:
                        passed = False
                        details = f"Wrong category items: {len(wrong_category)}"
                    else:
                        details = f"Status: {response.status_code}, {category} count: {len(products)}"
                else:
                    details = f"Status: {response.status_code}"
                
                self.log_test(f"Get Products - Category {category}", passed, details, response.elapsed.total_seconds())
                results.append(passed)
                
            except Exception as e:
                self.log_test(f"Get Products - Category {category}", False, f"Error: {str(e)}")
                results.append(False)
        
        return all(results)

    def test_get_featured_products(self):
        """Test featured products filtering"""
        try:
            response = requests.get(f"{self.api_url}/products?featured=true", timeout=10)
            passed = response.status_code == 200
            
            if passed:
                products = response.json()
                # Verify all products are featured
                non_featured = [p for p in products if not p.get('is_featured')]
                if non_featured:
                    passed = False
                    details = f"Non-featured items found: {len(non_featured)}"
                else:
                    details = f"Status: {response.status_code}, Featured count: {len(products)}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Get Featured Products", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Get Featured Products", False, f"Error: {str(e)}")
            return False

    def test_get_product_by_id(self, product_id):
        """Test getting single product by ID"""
        try:
            response = requests.get(f"{self.api_url}/products/{product_id}", timeout=10)
            passed = response.status_code == 200
            
            if passed:
                product = response.json()
                # Verify product structure
                required_fields = ['id', 'name', 'category', 'description', 'features', 'image_url']
                missing_fields = [field for field in required_fields if field not in product]
                if missing_fields:
                    passed = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    details = f"Status: {response.status_code}, Product: {product.get('name', 'Unknown')}"
                    # Verify ID matches
                    if product.get('id') != product_id:
                        passed = False
                        details += f", ID mismatch: expected {product_id}, got {product.get('id')}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Get Product by ID", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Get Product by ID", False, f"Error: {str(e)}")
            return False

    def test_get_nonexistent_product(self):
        """Test 404 for nonexistent product"""
        fake_id = "nonexistent-product-id-12345"
        try:
            response = requests.get(f"{self.api_url}/products/{fake_id}", timeout=10)
            passed = response.status_code == 404
            details = f"Status: {response.status_code} (expected 404)"
            
            self.log_test("Get Nonexistent Product", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Get Nonexistent Product", False, f"Error: {str(e)}")
            return False

    def test_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "0555 555 55 55", 
            "subject": "API Test Message",
            "message": "Bu bir API test mesajıdır."
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact", 
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            passed = response.status_code == 200
            
            if passed:
                result = response.json()
                # Verify response structure
                expected_fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
                missing_fields = [field for field in expected_fields if field not in result]
                if missing_fields:
                    passed = False
                    details = f"Missing fields in response: {missing_fields}"
                else:
                    # Verify data matches
                    data_matches = (
                        result.get('name') == test_data['name'] and
                        result.get('email') == test_data['email'] and
                        result.get('subject') == test_data['subject'] and
                        result.get('message') == test_data['message']
                    )
                    if not data_matches:
                        passed = False
                        details = "Response data doesn't match input"
                    else:
                        details = f"Status: {response.status_code}, Message ID: {result.get('id', 'Unknown')}"
            else:
                details = f"Status: {response.status_code}"
                if response.headers.get('content-type', '').startswith('application/json'):
                    try:
                        error_data = response.json()
                        details += f", Error: {error_data.get('detail', 'Unknown error')}"
                    except:
                        pass
            
            self.log_test("Contact Form Submission", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Contact Form Submission", False, f"Error: {str(e)}")
            return False

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        # Test missing required fields
        invalid_data = {
            "name": "",  # Required
            "email": "invalid-email",  # Invalid format
            "subject": "",  # Required
            "message": ""  # Required
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=invalid_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should return 422 for validation errors
            passed = response.status_code == 422
            details = f"Status: {response.status_code} (expected 422 for validation errors)"
            
            self.log_test("Contact Form Validation", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Contact Form Validation", False, f"Error: {str(e)}")
            return False

    def test_seed_products(self):
        """Test product seeding endpoint"""
        try:
            response = requests.post(f"{self.api_url}/seed-products", timeout=15)
            passed = response.status_code == 200
            
            if passed:
                result = response.json()
                details = f"Status: {response.status_code}, Message: {result.get('message', 'No message')}"
                if 'count' in result:
                    details += f", Count: {result['count']}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Seed Products", passed, details, response.elapsed.total_seconds())
            return passed
            
        except Exception as e:
            self.log_test("Seed Products", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🧪 Starting İbed Backend API Tests")
        print(f"🌐 Base URL: {self.base_url}")
        print(f"🔌 API URL: {self.api_url}")
        print("="*60)
        
        # Test API root
        api_available = self.test_api_root()
        if not api_available:
            print("\n❌ API not available, stopping tests")
            return False
        
        # Test product seeding (ensure products exist)
        self.test_seed_products()
        
        # Test products endpoints
        products_success, products = self.test_get_all_products()
        
        if products_success and products:
            # Test product by ID using first product
            first_product_id = products[0].get('id')
            if first_product_id:
                self.test_get_product_by_id(first_product_id)
        
        # Test category filtering
        self.test_get_products_by_category()
        
        # Test featured products
        self.test_get_featured_products()
        
        # Test 404 handling
        self.test_get_nonexistent_product()
        
        # Test contact form
        self.test_contact_form()
        self.test_contact_form_validation()
        
        # Print summary
        print("\n" + "="*60)
        print(f"📊 Test Summary:")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"🧪 Total Tests: {self.tests_run}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print detailed results
        print(f"\n📋 Detailed Results:")
        for result in self.test_results:
            status_icon = "✅" if result["status"] == "PASS" else "❌"
            time_info = f" ({result['response_time']:.3f}s)" if result['response_time'] else ""
            print(f"{status_icon} {result['test']}: {result['details']}{time_info}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test function"""
    tester = IbedAPITester()
    success = tester.run_all_tests()
    
    # Return exit code based on test results
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())