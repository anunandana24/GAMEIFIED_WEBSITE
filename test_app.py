"""
PyCampus Quest Automated Test Suite
Software Quality Assurance & Workflow Tester
Tests routes, API endpoints, code runner sandbox, security guards, and game logic.
"""

import unittest
import json
import html
from app import app, LEVELS, LEVELS_BY_ID, execute_user_code, BOSS_BATTLE

class PyCampusTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    # ==========================================================================
    # 1. CORE WEB ROUTE TESTS
    # ==========================================================================
    def test_homepage_loads(self):
        """Test main campus hub map loads with 200 status"""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"PyCampus", response.data)
        self.assertIn(b"Campus Academic Quest Map", response.data)

    def test_arcade_route_loads(self):
        """Test Bug Buster arcade view loads"""
        response = self.client.get("/arcade")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Bug Buster", response.data)

    def test_boss_battle_route_loads(self):
        """Test Placement Technical Interview boss battle view loads"""
        response = self.client.get("/boss")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Placement", response.data)
        self.assertIn(b"Technical Interview", response.data)

    def test_sandbox_route_loads(self):
        """Test Interactive Python Sandbox view loads"""
        response = self.client.get("/sandbox")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"PyCampus Code Playground", response.data)

    def test_certificate_route_loads(self):
        """Test College Certificate view loads"""
        response = self.client.get("/certificate")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"PYCAMPUS UNIVERSITY OF TECHNOLOGY", response.data)

    # ==========================================================================
    # 2. ALL 22 LEVELS INTEGRITY TESTS
    # ==========================================================================
    def test_all_22_levels_defined(self):
        """Ensure all 22 required Python concepts from prompt are present"""
        self.assertEqual(len(LEVELS), 22)
        expected_concepts = [
            "primitive-types", "non-primitive-types", "lists", "tuples",
            "sets", "dicts", "functions", "classes-objects",
            "encapsulation", "inheritance", "polymorphism", "abstraction",
            "exceptions", "file-handling", "higher-order-functions",
            "database", "regex", "multithreading", "json-pickle",
            "iterators", "generators", "decorators"
        ]
        level_ids = [lvl["id"] for lvl in LEVELS]
        for concept in expected_concepts:
            self.assertIn(concept, level_ids, f"Missing concept: {concept}")

    def test_individual_level_routes(self):
        """Verify each of the 22 level pages renders successfully"""
        for lvl in LEVELS:
            response = self.client.get(f"/game/{lvl['id']}")
            self.assertEqual(
                response.status_code, 200,
                f"Level route /game/{lvl['id']} failed with {response.status_code}"
            )
            decoded = html.unescape(response.data.decode("utf-8"))
            self.assertIn(lvl["title"], decoded)
            self.assertIn("Knowledge Archive Encrypted", decoded)

    def test_invalid_level_redirects(self):
        """Accessing a non-existent level should gracefully redirect to home"""
        response = self.client.get("/game/non-existent-topic-xyz")
        self.assertEqual(response.status_code, 302)

    # ==========================================================================
    # 3. REST API ENDPOINT TESTS
    # ==========================================================================
    def test_api_levels_list(self):
        """Test GET /api/levels metadata endpoint"""
        response = self.client.get("/api/levels")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["count"], 22)
        self.assertEqual(len(data["levels"]), 22)

    def test_api_level_detail(self):
        """Test GET /api/level/<id> endpoint"""
        response = self.client.get("/api/level/primitive-types")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["level"]["title"], "Primitive Data Types")

    def test_api_leaderboard(self):
        """Test GET /api/leaderboard endpoint"""
        response = self.client.get("/api/leaderboard")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "success")
        self.assertGreater(len(data["leaderboard"]), 0)

    # ==========================================================================
    # 4. PYTHON CODE EXECUTION & SANDBOX SECURITY TESTS
    # ==========================================================================
    def test_code_execution_stdout(self):
        """Verify user code execution captures stdout cleanly"""
        payload = {"code": "print('Hello PyCampus 2026!')"}
        response = self.client.post(
            "/api/run_code",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data["success"])
        self.assertIn("Hello PyCampus 2026!", data["output"])

    def test_code_execution_test_expression(self):
        """Verify code execution with test assertion expression"""
        payload = {
            "code": "def add(a, b): return a + b",
            "test_input_expr": "add(10, 25)",
            "expected_result": "35"
        }
        response = self.client.post(
            "/api/run_code",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data["success"])
        self.assertEqual(data["eval_result"], "35")
        self.assertTrue(data["passed_assertion"])

    def test_sandbox_security_blocks_dangerous_calls(self):
        """Verify security guardrails block restricted modules like subprocess"""
        payload = {"code": "import subprocess; subprocess.run(['ls'])"}
        response = self.client.post(
            "/api/run_code",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertFalse(data["success"])
        self.assertIn("Security Exception", data["error"])

    def test_code_execution_runtime_error_handling(self):
        """Verify runtime exceptions are caught and reported without crashing"""
        payload = {"code": "x = 1 / 0"}
        response = self.client.post(
            "/api/run_code",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertFalse(data["success"])
        self.assertIn("ZeroDivisionError", data["error"])

    # ==========================================================================
    # 5. CHALLENGE VERIFICATION TESTS (STARTER CODE QUALITY)
    # ==========================================================================
    def test_level_1_solution_passes(self):
        """Verify that Level 1 solution code correctly passes its test cases"""
        lvl = LEVELS_BY_ID["primitive-types"]
        payload = {
            "level_id": "primitive-types",
            "code": lvl["code_challenge"]["solution_code"]
        }
        response = self.client.post(
            "/api/verify_challenge",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data["success"])
        self.assertEqual(data["xp_earned"], 100)
        self.assertEqual(data["badge"], "Freshman Byte Cadet")

    def test_starter_codes_require_student_implementation(self):
        """Verify starter codes are skeletons requiring students to write implementation"""
        for lvl in LEVELS:
            starter = lvl["code_challenge"]["starter_code"]
            self.assertIn("TODO", starter, f"Level {lvl['id']} should have TODO in starter code for student practice")
            self.assertIn("pass", starter, f"Level {lvl['id']} should have pass in starter code")

        for r in BOSS_BATTLE["rounds"]:
            self.assertIn("TODO", r["starter_code"], f"Boss Round {r['round_num']} should have TODO in starter code")

    def test_invalid_solution_fails(self):
        """Verify that a broken solution fails test assertions gracefully"""
        payload = {
            "level_id": "primitive-types",
            "code": "def evaluate_student(*args): return 'Wrong Output'"
        }
        response = self.client.post(
            "/api/verify_challenge",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertFalse(data["success"])

    def test_all_22_level_solutions_pass(self):
        """Verify that EVERY single level reference solution passes its designated test cases"""
        for lvl in LEVELS:
            payload = {
                "level_id": lvl["id"],
                "code": lvl["code_challenge"]["solution_code"]
            }
            response = self.client.post(
                "/api/verify_challenge",
                data=json.dumps(payload),
                content_type="application/json"
            )
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(
                data["success"],
                f"Level {lvl['order']} ({lvl['id']}) solution failed challenge verification: {data.get('results')}"
            )

    # ==========================================================================
    # 6. BOSS BATTLE ROUNDS VERIFICATION
    # ==========================================================================
    def test_boss_battle_round_solutions(self):
        """Verify all 3 Boss Battle solutions pass their interview tests"""
        for round_data in BOSS_BATTLE["rounds"]:
            code = round_data["solution_code"]
            for test in round_data["tests"]:
                res = execute_user_code(code, test["input"])
                self.assertTrue(res["success"], f"Boss Round {round_data['round_num']} execution failed: {res.get('error')}")
                actual = str(res.get("eval_result", "")).strip()
                expected = str(test["expected"]).strip()
                self.assertEqual(
                    actual, expected,
                    f"Boss Round {round_data['round_num']} test assertion failed. Expected: {expected}, Got: {actual}"
                )

if __name__ == "__main__":
    unittest.main()
